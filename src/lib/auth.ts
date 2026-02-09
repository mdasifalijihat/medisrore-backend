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
          from: `"Prisma Blog" <${process.env.APP_USER}>`,
          to: user.email,
          subject: "Verify your email",
          html: `
        <!DOCTYPE html>
        <html>
          <body style="margin:0;padding:0;background:#f6f9fc;font-family:Arial,sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center" style="padding:40px 0;">
                  <table width="100%" style="max-width:420px;background:#ffffff;border-radius:8px;padding:32px;text-align:center;">
                    <tr>
                      <td>
                        <h2 style="margin:0 0 12px;color:#111;">Verify your email</h2>
                        <p style="margin:0 0 24px;color:#555;font-size:14px;">
                          Thanks for signing up! Click the button below to verify your email address.
                        </p>
        
                        <a
                          href="${verificationUrl}"
                          style="
                            display:inline-block;
                            padding:12px 20px;
                            background:#4f46e5;
                            color:#ffffff;
                            text-decoration:none;
                            border-radius:6px;
                            font-size:14px;
                            font-weight:600;
                          "
                        >
                          Verify Email
                        </a>
        
                        <p style="margin:24px 0 0;font-size:12px;color:#888;">
                          If you didn’t create an account, you can safely ignore this email.
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
});
