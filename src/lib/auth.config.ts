import type { NextAuthConfig } from 'next-auth';
import Resend from 'next-auth/providers/resend';
import { Resend as ResendClient } from 'resend';
import Google from 'next-auth/providers/google';

const resend = new ResendClient(process.env.AUTH_RESEND_KEY);

export default {
  trustHost: true,
  providers: [
    Google({
      authorization:
        'https://accounts.google.com/o/oauth2/v2/auth?' +
        new URLSearchParams({
          prompt: 'consent select_account',
          access_type: 'offline',
          response_type: 'code',
          scope:
            'openid profile email https://www.googleapis.com/auth/calendar',
        }).toString(),
    }),
    Resend({
      // ⚠️ Use a real domain in production (e.g. 'auth@yourdomain.com')
      from: 'onboarding@resend.dev',

      async sendVerificationRequest({
        identifier: email,
        url,
        provider: { from },
      }) {
        const result = await resend.emails.send({
          from: from || 'onboarding@resend.dev',
          to: email,
          subject: 'Sign in to Velox AI',
          // 1. ADDED: Plain text fallback for better deliverability
          text: `Sign in to Velox AI\n\nPlease click the link below to sign in:\n\n${url}\n\nThis link expires in 24 hours.`,
          // 2. REDESIGNED: Professional HTML Email
          html: `
            <body style="background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">
              <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                
                <div style="background-color: #ffffff; padding: 40px 30px; border-radius: 12px; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                  
                  <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #111827; font-size: 24px; font-weight: 700; margin: 0; letter-spacing: -0.5px;">Velox AI</h1>
                  </div>

                  <p style="color: #4b5563; font-size: 16px; line-height: 24px; text-align: center; margin-bottom: 30px;">
                    Hello! Click the button below to securely sign in to your account.
                  </p>

                  <div style="text-align: center; margin-bottom: 30px;">
                    <a href="${url}" target="_blank" style="background-color: #4f46e5; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2); border: 1px solid #4f46e5;">
                      Sign In
                    </a>
                  </div>

                  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />

                  <p style="color: #9ca3af; font-size: 13px; line-height: 20px; text-align: center; margin: 0;">
                    If you didn't request this email, you can safely ignore it.<br/>
                    This link will expire in 24 hours.
                  </p>

                </div>
                
                <div style="text-align: center; margin-top: 20px;">
                  <p style="color: #9ca3af; font-size: 12px;">&copy; ${new Date().getFullYear()} Velox AI. All rights reserved.</p>
                </div>
              </div>
            </body>
          `,
        });

        if (result.error) {
          throw new Error(`Email not sent: ${result.error.message}`);
        }
      },
    }),
  ],
} satisfies NextAuthConfig;
