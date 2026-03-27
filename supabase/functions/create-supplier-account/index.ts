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

    const { email, company_name, contact_name, phone, address } = await req.json();

    if (!email || !company_name || !contact_name) {
      throw new Error("Missing required fields");
    }

    // Create user account with temporary password
    const tempPassword = crypto.randomUUID();
    
    const { data: newUser, error: createError } = await supabaseClient.auth.admin.createUser({
      email,
      password: tempPassword,
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
      // Cleanup user if role insert fails
      await supabaseClient.auth.admin.deleteUser(newUser.user.id);
      throw roleError;
    }

    // Create supplier record
    const { error: supplierError } = await supabaseClient
      .from("suppliers")
      .insert({
        user_id: newUser.user.id,
        company_name,
        contact_name,
        contact_email: email,
        phone,
        address,
        is_active: true,
      });

    if (supplierError) {
      // Cleanup
      await supabaseClient.auth.admin.deleteUser(newUser.user.id);
      throw supplierError;
    }

    // Send password reset email so supplier can set their password
    const { error: resetError } = await supabaseClient.auth.admin.generateLink({
      type: "recovery",
      email,
    });

    if (resetError) {
      console.error("Failed to send reset email:", resetError);
    }

    // Send invitation email via Resend
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (resendApiKey) {
      const siteUrl = Deno.env.get("SITE_URL") || "https://resurrected.com";
      
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Resurrected <noreply@resurrected.com>",
          to: [email],
          subject: "Welcome to Resurrected Supplier Portal",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #333;">Welcome to Resurrected</h1>
              <p>Hello ${contact_name},</p>
              <p>You have been added as a supplier partner for ${company_name}.</p>
              <p>To access your supplier portal, please set your password by clicking the link below:</p>
              <p><a href="${siteUrl}/set-password" style="background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Set Your Password</a></p>
              <p>After setting your password, you can log in at:</p>
              <p><a href="${siteUrl}/access">${siteUrl}/access</a></p>
              <p>Once logged in, you'll be able to:</p>
              <ul>
                <li>View orders assigned to you</li>
                <li>Update fulfillment status</li>
                <li>Add shipping information</li>
                <li>Chat with our team</li>
              </ul>
              <p>If you have any questions, please contact our team.</p>
              <p>Best regards,<br>Resurrected Team</p>
            </div>
          `,
        }),
      });
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Supplier account created",
        user_id: newUser.user.id 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );

  } catch (error: any) {
    console.error("Error creating supplier:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400 
      }
    );
  }
});
