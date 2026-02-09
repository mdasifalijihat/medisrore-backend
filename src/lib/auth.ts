import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: [process.env.APP_URL!],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
        const info = await transporter.sendMail({
          from: `"Medi Store" <${process.env.APP_USER}>`,
          to: user.email,
          subject: "Verify your email",
          html: `
          <!DOCTYPE html>
          <html>
            <body style="margin:0;padding:0;background:#f4f6fa;font-family:Arial,sans-serif;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:40px 0;">
                    <table width="100%" style="max-width:480px;background:#ffffff;border-radius:8px;padding:32px;text-align:center;box-shadow:0 2px 10px rgba(0,0,0,0.05);">
                      <tr>
                        <td>
                          <!-- Logo -->
                          <img src="https://cdn-icons-png.flaticon.com/512/2965/2965567.png" 
                               alt="MediStore Logo" 
                               width="80" 
                               style="margin-bottom:16px;" />
          
                          <!-- App Name -->
                          <h1 style="margin:0 0 12px;color:#4f46e5;font-size:28px;font-weight:bold;">MediStore</h1>
                          <h2 style="margin:0 0 16px;color:#111;font-size:20px;">Verify your email</h2>
          
                          <p style="margin:0 0 24px;color:#555;font-size:14px;line-height:1.5;">
                            Thank you for signing up to <strong>MediStore</strong>! Please click the button below to verify your email address and start managing your medicines and orders.
                          </p>
          
                          <a
                            href="${verificationUrl}"
                            style="
                              display:inline-block;
                              padding:14px 24px;
                              background:#4f46e5;
                              color:#ffffff;
                              text-decoration:none;
                              border-radius:6px;
                              font-size:16px;
                              font-weight:600;
                            "
                          >
                            Verify Email
                          </a>
          
                          <p style="margin:24px 0 0;font-size:12px;color:#888;line-height:1.4;">
                            If you didn’t create an account on <strong>MediStore</strong>, you can safely ignore this email.
                          </p>
          
                          <p style="margin:16px 0 0;font-size:12px;color:#aaa;">
                            &copy; ${new Date().getFullYear()} MediStore. All rights reserved.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
          </html>
          `,
        });
        console.log("Message send", info.messageId);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      accessType: "offline",
      prompt: "select_account consent",
    },
  },
});
