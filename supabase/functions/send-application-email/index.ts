import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

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
  approvalLink?: string; // Deprecated, kept for backward compatibility
}

const getConfirmationEmailHTML = (contactName: string, businessName: string) => `
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
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; border-bottom: 1px solid #222;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 300; color: #ffffff; letter-spacing: 2px;">PØINT</h1>
              <p style="margin: 4px 0 0; font-size: 11px; color: #888; letter-spacing: 3px; text-transform: uppercase;">BioSciences</p>
            </td>
          </tr>
          
          <!-- Content -->
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
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #0a0a0a; border-top: 1px solid #222;">
              <p style="margin: 0; font-size: 12px; color: #666; text-align: center;">
                © ${new Date().getFullYear()} PØINT BioSciences. All rights reserved.
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
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; border-bottom: 1px solid #222;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 300; color: #ffffff; letter-spacing: 2px;">PØINT</h1>
              <p style="margin: 4px 0 0; font-size: 11px; color: #888; letter-spacing: 3px; text-transform: uppercase;">BioSciences</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="display: inline-block; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); border-radius: 50%; width: 60px; height: 60px; line-height: 60px;">
                  <span style="font-size: 28px;">✓</span>
                </div>
              </div>
              
              <h2 style="margin: 0 0 20px; font-size: 24px; font-weight: 500; color: #ffffff; text-align: center;">Welcome to PØINT BioSciences!</h2>
              
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
                  This is a one-time link to set up your password. After setting your password, you can sign in anytime at <a href="https://pointbiosciences.com" style="color: #6366f1;">pointbiosciences.com</a>
                </p>
              </div>
              
              <div style="background-color: #1a1a1a; border-left: 3px solid #6366f1; padding: 20px; margin: 30px 0; border-radius: 0 8px 8px 0;">
                <p style="margin: 0; font-size: 14px; color: #aaaaaa;">
                  <strong style="color: #ffffff;">What you can do once signed in:</strong><br><br>
                  • Browse our complete product catalog<br>
                  • Place orders directly through the portal<br>
                  • Access exclusive partner pricing<br>
                  • Download certificates of analysis
                </p>
              </div>
              
              <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #cccccc;">
                We're excited to have you as a partner. If you have any questions or need assistance getting started, don't hesitate to reach out.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #0a0a0a; border-top: 1px solid #222;">
              <p style="margin: 0; font-size: 12px; color: #666; text-align: center;">
                © ${new Date().getFullYear()} PØINT BioSciences. All rights reserved.
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

    const { type, email, contactName, businessName, setupLink, approvalLink }: EmailRequest = await req.json();

    if (!type || !email || !contactName || !businessName) {
      throw new Error("Missing required fields: type, email, contactName, businessName");
    }

    let subject: string;
    let html: string;

    if (type === "confirmation") {
      subject = "Application Received - PØINT BioSciences";
      html = getConfirmationEmailHTML(contactName, businessName);
    } else if (type === "approved") {
      // Use setupLink if provided, fall back to approvalLink for backward compatibility
      const link = setupLink || approvalLink || "https://pointbiosciences.com/access";
      subject = "Application Approved - Set Up Your Account";
      html = getApprovalEmailHTML(contactName, businessName, link);
    } else {
      throw new Error("Invalid email type. Must be 'confirmation' or 'approved'");
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "PØINT BioSciences <noreply@pointbiosciences.com>",
        to: [email],
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const errorData = await res.text();
      console.error("Resend API error:", errorData);
      throw new Error(`Failed to send email: ${errorData}`);
    }

    const data = await res.json();
    console.log(`${type} email sent successfully to ${email}:`, data);

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: unknown) {
    console.error("Error in send-application-email function:", error);
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
