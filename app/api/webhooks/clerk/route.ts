import { NextRequest } from "next/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { clerkClient } from "@clerk/nextjs/server";

import { sendEmail } from "@/lib/send-email";

export async function POST(req: NextRequest) {
  try {
    const signingSecret = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

    console.log("=== CLERK WEBHOOK DIAGNOSTIC ===");

    console.log(
      "Signing secret exists:",
      Boolean(signingSecret)
    );

    console.log(
      "Signing secret length:",
      signingSecret?.length ?? 0
    );

    if (signingSecret) {
      const invalidSecretChars = Array.from(signingSecret)
        .map((char, index) => ({
          index,
          codePoint: char.codePointAt(0),
        }))
        .filter(
          ({ codePoint }) =>
            codePoint !== undefined && codePoint > 127
        );

      console.log(
        "Non-ASCII characters in signing secret:",
        invalidSecretChars
      );
    }

    const headerDiagnostics = Array.from(req.headers.entries()).map(
      ([name, value]) => {
        const invalidCharacters = Array.from(value)
          .map((char, index) => ({
            index,
            codePoint: char.codePointAt(0),
          }))
          .filter(
            ({ codePoint }) =>
              codePoint !== undefined && codePoint > 127
          );

        return {
          name,
          length: value.length,
          nonAscii: invalidCharacters,
        };
      }
    );

    console.log(
      "Webhook header diagnostics:",
      headerDiagnostics
    );

    const evt = await verifyWebhook(req);

    if (evt.type !== "session.created") {
      return new Response("Event ignored", {
        status: 200,
      });
    }

    const userId = evt.data.user_id;

    if (!userId) {
      console.error(
        "Clerk webhook: user ID missing from session."
      );

      return new Response(
        "User ID missing",
        {
          status: 400,
        }
      );
    }

    /*
     * session.created contains session data.
     * Fetch the full Clerk user using the
     * Production Clerk Backend API.
     */
    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    const primaryEmailId =
      user.primaryEmailAddressId;

    const primaryEmail =
      user.emailAddresses.find(
        (email) =>
          email.id === primaryEmailId
      );

    const email =
      primaryEmail?.emailAddress;

    if (!email) {
      console.error(
        "Clerk webhook: no primary email found.",
        {
          userId,
          primaryEmailId,
        }
      );

      return new Response(
        "No email address available",
        {
          status: 200,
        }
      );
    }

    const firstName =
      user.firstName || "there";

    const emailResult = await sendEmail({
      to: email,

      subject:
        "New sign-in to CoachDM AI",

      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: 0 auto;
          padding: 40px 20px;
          color: #18181b;
        ">

          <h1 style="
            margin-bottom: 8px;
            font-size: 28px;
          ">
            Welcome back, ${firstName} 👋
          </h1>

          <p style="
            font-size: 16px;
            line-height: 1.6;
            color: #52525b;
          ">
            Your CoachDM AI account was just signed in.
          </p>

          <div style="
            margin: 28px 0;
            padding: 20px;
            border-radius: 12px;
            background: #f4f4f5;
          ">

            <p style="
              margin: 0 0 8px;
              font-weight: 600;
            ">
              Sign-in notification
            </p>

            <p style="
              margin: 0;
              color: #52525b;
              line-height: 1.5;
            ">
              If this was you, you can safely ignore
              this email.
            </p>

          </div>

          <p style="
            font-size: 14px;
            line-height: 1.6;
            color: #71717a;
          ">
            If you don't recognize this sign-in,
            please secure your account immediately.
          </p>

          <p style="
            margin-top: 32px;
            font-size: 15px;
          ">
            <strong>CoachDM AI</strong>
          </p>

        </div>
      `,

      text: `Welcome back, ${firstName}!

Your CoachDM AI account was just signed in.

If this was you, you can safely ignore this email.

If you don't recognize this sign-in, please secure your account immediately.

CoachDM AI`,
    });

    if (!emailResult.success) {
      console.error(
        "Login notification email failed:",
        emailResult.error
      );

      /*
       * Return 500 so Clerk knows the webhook
       * processing failed and can retry.
       */
      return new Response(
        "Email sending failed",
        {
          status: 500,
        }
      );
    }

    console.log(
      `Login notification sent to ${email}`
    );

    return new Response(
      "Webhook received",
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Clerk webhook error:",
      error
    );

    return new Response(
      "Webhook processing failed",
      {
        status: 500,
      }
    );
  }
}