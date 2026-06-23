import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface CreatePartnerRequest {
  applicationId: string;
  email: string;
  contactName: string;
  businessName: string;
  phone?: string;
  website?: string;
  country?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Verify the caller is an admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !userData.user) {
      return new Response(
        JSON.stringify({ error: "Invalid authentication" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Check admin role
    const { data: roles, error: rolesError } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id)
      .eq("role", "admin");

    if (rolesError || !roles || roles.length === 0) {
      return new Response(
        JSON.stringify({ error: "Admin access required" }),
        { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const body: CreatePartnerRequest = await req.json();
    const { applicationId, email, contactName, businessName, phone, website, country } = body;

    // Input validation
    if (!applicationId || !email || !contactName || !businessName) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) || email.length > 255) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // UUID validation
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(applicationId)) {
      return new Response(
        JSON.stringify({ error: "Invalid application ID" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Length validation
    if (contactName.length > 200 || businessName.length > 200) {
      return new Response(
        JSON.stringify({ error: "Input exceeds maximum length" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Check if user already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(u => u.email === email);

    let userId: string;
    let setupLink: string;

    if (existingUser) {
      userId = existingUser.id;
      
      const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
        type: "magiclink",
        email,
        options: { redirectTo: `https://resurrected.com/set-password` },
      });

      if (linkError) {
        console.error("Link generation error:", linkError);
        return new Response(
          JSON.stringify({ error: "Failed to generate setup link" }),
          { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      setupLink = linkData.properties.action_link;
    } else {
      const tempPassword = crypto.randomUUID() + "Aa1!";
      
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password: tempPassword,
        email_confirm: true,
        user_metadata: { contact_name: contactName, business_name: businessName },
      });

      if (createError) {
        console.error("User creation error:", createError);
        return new Response(
          JSON.stringify({ error: "Failed to create account" }),
          { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      userId = newUser.user.id;

      const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
        type: "magiclink",
        email,
        options: { redirectTo: `https://resurrected.com/set-password` },
      });

      if (linkError) {
        console.error("Link generation error:", linkError);
        return new Response(
          JSON.stringify({ error: "Failed to generate setup link" }),
          { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      setupLink = linkData.properties.action_link;
    }

    // Parse contact name
    const nameParts = contactName.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    // Fetch application for company logo
    const { data: applicationData } = await supabaseAdmin
      .from("applications")
      .select("company_logo_url")
      .eq("id", applicationId)
      .single();

    // Upsert profile
    await supabaseAdmin
      .from("profiles")
      .upsert({
        user_id: userId,
        first_name: firstName,
        last_name: lastName,
        business_name: businessName,
        business_email: email,
        phone: phone || null,
        website: website || null,
        country: country || null,
        status: "approved",
        company_logo_url: applicationData?.company_logo_url || null,
      }, { onConflict: "user_id" });

    // Grant the b2b role so the account unlocks the wholesale portal & nav
    await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: userId, role: "b2b" })
      .select()
      .maybeSingle()
      .then(() => undefined, () => undefined);



    // Update application with user_id
    await supabaseAdmin
      .from("applications")
      .update({ user_id: userId })
      .eq("id", applicationId);

    // Audit log
    await supabaseAdmin.from("security_audit_log").insert({
      user_id: userData.user.id,
      action: "partner_account_created",
      resource_type: "application",
      resource_id: applicationId,
      metadata: { partner_email: email, business_name: businessName },
    });

    return new Response(
      JSON.stringify({ success: true, userId, setupLink }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: unknown) {
    console.error("Error in create-partner-account:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create partner account" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
