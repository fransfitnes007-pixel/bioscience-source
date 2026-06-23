import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface EmailRequest {
  type: "confirmation" | "approved";
  email: string;
  contactName: string;
  businessName: string;
  setupLink?: string;
  approvalLink?: string;
}

const LOGO_URL = "https://nunwpsiixyqmbgvvokmq.supabase.co/storage/v1/object/public/email-assets/logo-white.png";

// Escape user-supplied values before interpolating into HTML templates
const escapeHtml = (s: string): string =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const getConfirmationEmailHTML = (rawContactName: string, rawBusinessName: string) => {
  const contactName = escapeHtml(rawContactName);
  const businessName = escapeHtml(rawBusinessName);
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Application Received</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0a0a0a;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #111111; border-radius: 12px; overflow: hidden;">
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; border-bottom: 1px solid #222;">
              <img src="${LOGO_URL}" alt="Resurrected" width="180" style="max-width: 180px; height: auto;" />
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; font-size: 24px; font-weight: 500; color: #ffffff;">Application Received</h2>
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #cccccc;">
                Hi ${contactName},
              </p>
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #cccccc;">
                Thank you for submitting your application for <strong style="color: #ffffff;">${businessName}</strong>. We've received your information and our team is currently reviewing it.
              </p>
              <div style="background-color: #1a1a1a; border-left: 3px solid #6366f1; padding: 20px; margin: 30px 0; border-radius: 0 8px 8px 0;">
                <p style="margin: 0; font-size: 14px; color: #aaaaaa;">
                  <strong style="color: #ffffff;">What happens next?</strong><br><br>
                  Our team will review your application within 24-48 hours. Once approved, you'll receive an email with a link to set up your account password.
                </p>
              </div>
              <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #cccccc;">
                If you have any questions in the meantime, feel free to reply to this email.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px 40px; background-color: #0a0a0a; border-top: 1px solid #222;">
              <p style="margin: 0; font-size: 12px; color: #666; text-align: center;">
                © ${new Date().getFullYear()} Resurrected. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const getApprovalEmailHTML = (contactName: string, businessName: string, setupLink: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Application Approved - Set Up Your Account</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0a0a0a;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #111111; border-radius: 12px; overflow: hidden;">
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; border-bottom: 1px solid #222;">
              <img src="${LOGO_URL}" alt="Resurrected" width="180" style="max-width: 180px; height: auto;" />
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="display: inline-block; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); border-radius: 50%; width: 60px; height: 60px; line-height: 60px;">
                  <span style="font-size: 28px;">✓</span>
                </div>
              </div>
              <h2 style="margin: 0 0 20px; font-size: 24px; font-weight: 500; color: #ffffff; text-align: center;">Welcome to Resurrected!</h2>
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #cccccc;">
                Hi ${contactName},
              </p>
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #cccccc;">
                Great news! Your application for <strong style="color: #ffffff;">${businessName}</strong> has been approved. To get started, please set up your account password by clicking the button below.
              </p>
              <div style="text-align: center; margin: 40px 0;">
                <a href="${setupLink}" style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 16px; font-weight: 500;">
                  Set Up Your Password
                </a>
              </div>
              <div style="background-color: #1a1a1a; border-left: 3px solid #f59e0b; padding: 20px; margin: 30px 0; border-radius: 0 8px 8px 0;">
                <p style="margin: 0; font-size: 14px; color: #aaaaaa;">
                  <strong style="color: #ffffff;">⚠️ Important:</strong><br><br>
                  This is a one-time link to set up your password. After setting your password, you can sign in anytime at <a href="https://resurrected.com" style="color: #6366f1;">resurrected.com</a>
                </p>
              </div>
              <div style="background-color: #1a1a1a; border-left: 3px solid #6366f1; padding: 20px; margin: 30px 0; border-radius: 0 8px 8px 0;">
                <p style="margin: 0; font-size: 14px; color: #aaaaaa;">
                  <strong style="color: #ffffff;">What you can do once signed in:</strong><br><br>
                  • Browse our complete product catalog<br>
                  • Place orders directly through your account<br>
                  • Track your shipments in real-time<br>
                  • Download certificates of analysis
                </p>
              </div>
              <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #cccccc;">
                We're excited to have you on board. If you have any questions, don't hesitate to reach out.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px 40px; background-color: #0a0a0a; border-top: 1px solid #222;">
              <p style="margin: 0; font-size: 12px; color: #666; text-align: center;">
                © ${new Date().getFullYear()} Resurrected. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { type, email, contactName, businessName, setupLink, approvalLink }: EmailRequest = await req.json();

    if (!type || !email || !contactName || !businessName) {
      throw new Error("Missing required fields: type, email, contactName, businessName");
    }

    if (type === "confirmation") {
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
      
      const { data: recentApplication, error: appError } = await supabaseAdmin
        .from("applications")
        .select("id, email, contact_name, business_name")
        .eq("email", email)
        .gte("created_at", tenMinutesAgo)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (appError || !recentApplication) {
        return new Response(
          JSON.stringify({ success: false, error: "No recent application found for this email" }),
          { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      if (recentApplication.contact_name !== contactName || recentApplication.business_name !== businessName) {
        return new Response(
          JSON.stringify({ success: false, error: "Application details do not match" }),
          { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
    } else if (type === "approved") {
      const authHeader = req.headers.get("Authorization");
      if (!authHeader?.startsWith("Bearer ")) {
        return new Response(
          JSON.stringify({ success: false, error: "Unauthorized - Admin authentication required" }),
          { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      const token = authHeader.replace("Bearer ", "");
      const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);

      if (userError || !userData.user) {
        return new Response(
          JSON.stringify({ success: false, error: "Invalid authentication token" }),
          { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      const { data: roles, error: rolesError } = await supabaseAdmin
        .from("user_roles")
        .select("role")
        .eq("user_id", userData.user.id)
        .eq("role", "admin");

      if (rolesError || !roles || roles.length === 0) {
        return new Response(
          JSON.stringify({ success: false, error: "Admin access required" }),
          { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      const { data: application, error: appError } = await supabaseAdmin
        .from("applications")
        .select("id")
        .eq("email", email)
        .limit(1)
        .single();

      if (appError || !application) {
        return new Response(
          JSON.stringify({ success: false, error: "No application found for this email" }),
          { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
    } else {
      throw new Error("Invalid email type. Must be 'confirmation' or 'approved'");
    }

    let subject: string;
    let html: string;

    if (type === "confirmation") {
      subject = "Application Received - Resurrected";
      html = getConfirmationEmailHTML(contactName, businessName);
    } else {
      const link = setupLink || approvalLink || "https://resurrected.com/access";
      subject = "Application Approved - Set Up Your Account";
      html = getApprovalEmailHTML(contactName, businessName, link);
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Resurrected <noreply@resurrected.com>",
        to: [email],
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const errorData = await res.text();
      console.error("Resend API error:", errorData);
      throw new Error("Failed to send email");
    }

    const data = await res.json();
    console.log(`${type} email sent successfully to ${email}:`, data);

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: unknown) {
    console.error("Error in send-application-email function:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to process email request" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
