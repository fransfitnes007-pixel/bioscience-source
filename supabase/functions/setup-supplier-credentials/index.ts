import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseClient = createClient(supabaseUrl, serviceRoleKey);

    // Verify caller is admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);

    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    // Check admin role
    const { data: roleData } = await supabaseClient
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .single();

    if (!roleData) {
      throw new Error("Admin access required");
    }

    const { username, password, company_name, contact_name } = await req.json();

    if (!username || !password) {
      throw new Error("Missing required fields");
    }

    // Create email from username (supplier.local domain for internal use)
    const email = `${username.toLowerCase()}@supplier.resurrected.com`;

    // Check if user already exists
    const { data: existingUsers } = await supabaseClient.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(u => u.email === email);

    if (existingUser) {
      // Update password for existing user
      const { error: updateError } = await supabaseClient.auth.admin.updateUserById(
        existingUser.id,
        { password }
      );
      
      if (updateError) throw updateError;

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Supplier credentials updated",
          user_id: existingUser.id,
          login_username: username
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200 
        }
      );
    }

    // Create new user account with specified password
    const { data: newUser, error: createError } = await supabaseClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (createError) {
      throw createError;
    }

    // Add supplier role
    const { error: roleError } = await supabaseClient
      .from("user_roles")
      .insert({
        user_id: newUser.user.id,
        role: "supplier",
      });

    if (roleError) {
      await supabaseClient.auth.admin.deleteUser(newUser.user.id);
      throw roleError;
    }

    // Create supplier record
    const { error: supplierError } = await supabaseClient
      .from("suppliers")
      .insert({
        user_id: newUser.user.id,
        company_name: company_name || "Point Peptide Supplier",
        contact_name: contact_name || "Supplier Partner",
        contact_email: email,
        is_active: true,
      });

    if (supplierError) {
      await supabaseClient.auth.admin.deleteUser(newUser.user.id);
      throw supplierError;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Supplier account created",
        user_id: newUser.user.id,
        login_username: username
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );

  } catch (error: any) {
    console.error("Error setting up supplier:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400 
      }
    );
  }
});
