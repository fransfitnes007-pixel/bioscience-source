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

    const { email, company_name, contact_name, phone, address } = await req.json();

    // Input validation
    if (!email || !company_name || !contact_name) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: email, company_name, contact_name" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Length validation
    if (company_name.length > 200 || contact_name.length > 200 || email.length > 255) {
      return new Response(
        JSON.stringify({ error: "Input fields exceed maximum length" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create user account with temporary password
    const tempPassword = crypto.randomUUID() + "Aa1!";
    
    const { data: newUser, error: createError } = await supabaseClient.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
    });

    if (createError) {
      console.error("User creation error:", createError);
      return new Response(
        JSON.stringify({ error: "Failed to create supplier account" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
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
      console.error("Role insert error:", roleError);
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
        company_name,
        contact_name,
        contact_email: email,
        phone: phone || null,
        address: address || null,
        is_active: true,
      });

    if (supplierError) {
      await supabaseClient.auth.admin.deleteUser(newUser.user.id);
      console.error("Supplier record error:", supplierError);
      return new Response(
        JSON.stringify({ error: "Failed to create supplier record" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Send password reset email so supplier can set their password
    await supabaseClient.auth.admin.generateLink({
      type: "recovery",
      email,
    });

    // Send invitation email via Resend
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (resendApiKey) {
      const siteUrl = "https://resurrected.com";
      const escapeHtml = (s: string): string =>
        String(s ?? "")
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#39;");
      const safeContactName = escapeHtml(contact_name);
      const safeCompanyName = escapeHtml(company_name);

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
              <p>Hello ${safeContactName},</p>
              <p>You have been added as a supplier partner for ${safeCompanyName}.</p>
              <p>To access your supplier portal, please set your password by clicking the link below:</p>
              <p><a href="${siteUrl}/set-password" style="background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Set Your Password</a></p>
              <p>After setting your password, you can log in at:</p>
              <p><a href="${siteUrl}/access">${siteUrl}/access</a></p>
              <p>Best regards,<br>Resurrected Team</p>
            </div>
          `,
        }),
      });
    }

    // Audit log
    await supabaseClient.from("security_audit_log").insert({
      user_id: user.id,
      action: "supplier_account_created",
      resource_type: "supplier",
      resource_id: newUser.user.id,
      metadata: { company_name, contact_name },
    });

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
  } catch (error: unknown) {
    console.error("Error creating supplier:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create supplier account" }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});
