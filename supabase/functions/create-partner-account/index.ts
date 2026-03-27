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

    // Create admin client with service role
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Verify the caller is an admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !userData.user) {
      throw new Error("Unauthorized");
    }

    // Check if user has admin role
    const { data: roles, error: rolesError } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id)
      .eq("role", "admin");

    if (rolesError || !roles || roles.length === 0) {
      throw new Error("Admin access required");
    }

    const {
      applicationId,
      email,
      contactName,
      businessName,
      phone,
      website,
      country,
    }: CreatePartnerRequest = await req.json();

    if (!applicationId || !email || !contactName || !businessName) {
      throw new Error("Missing required fields");
    }

    // Check if user already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(u => u.email === email);

    let userId: string;
    let setupLink: string;

    if (existingUser) {
      // User already exists, just generate a password reset link
      userId = existingUser.id;
      
      const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
        type: "magiclink",
        email: email,
        options: {
          redirectTo: `https://resurrected.com/set-password`,
        },
      });

      if (linkError) {
        throw new Error(`Failed to generate setup link: ${linkError.message}`);
      }

      setupLink = linkData.properties.action_link;
    } else {
      // Create new user with a random temporary password
      const tempPassword = crypto.randomUUID() + "Aa1!"; // Meets password requirements
      
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: email,
        password: tempPassword,
        email_confirm: true, // Auto-confirm the email
        user_metadata: {
          contact_name: contactName,
          business_name: businessName,
        },
      });

      if (createError) {
        throw new Error(`Failed to create user: ${createError.message}`);
      }

      userId = newUser.user.id;

      // Generate magic link for password setup
      const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
        type: "magiclink",
        email: email,
        options: {
          redirectTo: `https://pointbiosciences.com/set-password`,
        },
      });

      if (linkError) {
        throw new Error(`Failed to generate setup link: ${linkError.message}`);
      }

      setupLink = linkData.properties.action_link;
    }

    // Parse contact name into first/last
    const nameParts = contactName.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    // Fetch the application to get the company logo URL
    const { data: applicationData } = await supabaseAdmin
      .from("applications")
      .select("company_logo_url")
      .eq("id", applicationId)
      .single();

    // Update or create profile (include company_logo_url from application)
    const { error: profileError } = await supabaseAdmin
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
      }, {
        onConflict: "user_id",
      });

    if (profileError) {
      console.error("Profile upsert error:", profileError);
      // Don't throw - profile might already exist from trigger
    }

    // Update the application with the user_id
    const { error: appError } = await supabaseAdmin
      .from("applications")
      .update({ user_id: userId })
      .eq("id", applicationId);

    if (appError) {
      console.error("Application update error:", appError);
    }

    console.log(`Partner account created/updated for ${email}, userId: ${userId}`);

    return new Response(
      JSON.stringify({
        success: true,
        userId,
        setupLink,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: unknown) {
    console.error("Error in create-partner-account:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
