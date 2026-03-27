import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
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
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid authentication" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check admin role
    const { data: roleData } = await supabaseClient
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .single();

    if (!roleData) {
      return new Response(
        JSON.stringify({ error: "Admin access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { username, password, company_name, contact_name } = await req.json();

    // Input validation
    if (!username || !password) {
      return new Response(
        JSON.stringify({ error: "Username and password are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Username validation - alphanumeric only
    if (!/^[a-zA-Z0-9_-]+$/.test(username) || username.length > 50) {
      return new Response(
        JSON.stringify({ error: "Username must be alphanumeric and under 50 characters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Password strength validation
    if (password.length < 8) {
      return new Response(
        JSON.stringify({ error: "Password must be at least 8 characters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const email = `${username.toLowerCase()}@supplier.resurrected.com`;

    // Check if user already exists
    const { data: existingUsers } = await supabaseClient.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(u => u.email === email);

    if (existingUser) {
      const { error: updateError } = await supabaseClient.auth.admin.updateUserById(
        existingUser.id,
        { password }
      );
      
      if (updateError) {
        console.error("Update error:", updateError);
        return new Response(
          JSON.stringify({ error: "Failed to update credentials" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Audit log
      await supabaseClient.from("security_audit_log").insert({
        user_id: user.id,
        action: "supplier_credentials_updated",
        resource_type: "supplier",
        resource_id: existingUser.id,
      });

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Supplier credentials updated",
          user_id: existingUser.id,
          login_username: username
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    // Create new user account
    const { data: newUser, error: createError } = await supabaseClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (createError) {
      console.error("Create error:", createError);
      return new Response(
        JSON.stringify({ error: "Failed to create supplier account" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Add supplier role
    const { error: roleError } = await supabaseClient
      .from("user_roles")
      .insert({ user_id: newUser.user.id, role: "supplier" });

    if (roleError) {
      await supabaseClient.auth.admin.deleteUser(newUser.user.id);
      console.error("Role error:", roleError);
      return new Response(
        JSON.stringify({ error: "Failed to assign supplier role" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create supplier record
    const { error: supplierError } = await supabaseClient
      .from("suppliers")
      .insert({
        user_id: newUser.user.id,
        company_name: company_name || "Supplier Partner",
        contact_name: contact_name || "Supplier",
        contact_email: email,
        is_active: true,
      });

    if (supplierError) {
      await supabaseClient.auth.admin.deleteUser(newUser.user.id);
      console.error("Supplier error:", supplierError);
      return new Response(
        JSON.stringify({ error: "Failed to create supplier record" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Audit log
    await supabaseClient.from("security_audit_log").insert({
      user_id: user.id,
      action: "supplier_credentials_created",
      resource_type: "supplier",
      resource_id: newUser.user.id,
      metadata: { company_name, username },
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Supplier account created",
        user_id: newUser.user.id,
        login_username: username
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error setting up supplier:", error);
    return new Response(
      JSON.stringify({ error: "Failed to set up supplier credentials" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
