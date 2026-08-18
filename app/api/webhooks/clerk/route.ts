import { NextRequest } from "next/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";

import { sendEmail } from "@/lib/send-email";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    if (evt.type === "session.created") {
      const userId = evt.data.user_id;

      if (!userId) {
        return new Response("Missing user ID", {
          status: 400,
        });
      }

      // Get the user's email from Clerk
      const { clerkClient } = await import(
        "@clerk/nextjs/server"
      );

      const client = await clerkClient();

      const user =
        await client.users.getUser(userId);

      const email =
        user.primaryEmailAddress?.emailAddress;

      if (!email) {
        console.error(
          "No primary email found for user:",
          userId
        );

        return new Response(
          "No email address found",
          {
            status: 400,
          }
        );
      }

      const firstName =
        user.firstName || "there";

      await sendEmail({
        to: email,
        subject: "New sign-in to CoachDM AI",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #18181b;">
            <h1 style="margin-bottom: 8px;">
              Welcome back, ${firstName} 👋
            </h1>

            <p style="font-size: 16px; line-height: 1.6; color: #52525b;">
              Your CoachDM AI account was just signed in.
            </p>

            <div style="
              margin: 28px 0;
              padding: 20px;
              border-radius: 12px;
              background: #f4f4f5;
            ">
              <p style="margin: 0 0 8px; font-weight: 600;">
                Sign-in notification
              </p>

              <p style="margin: 0; color: #52525b;">
                If this was you, you can safely ignore this email.
              </p>
            </div>

            <p style="font-size: 14px; color: #71717a;">
              If you don't recognize this sign-in, please secure
              your account immediately.
            </p>

            <p style="margin-top: 32px;">
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

      console.log(
        `Login notification sent to ${email}`
      );
    }

    return new Response("Webhook received", {
      status: 200,
    });
  } catch (error) {
    console.error(
      "Clerk webhook error:",
      error
    );

    return new Response(
      "Webhook verification failed",
      {
        status: 400,
      }
    );
  }
}