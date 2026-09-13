import { NextRequest } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { Webhook } from "svix";

import { sendEmail } from "@/lib/send-email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();

    const signingSecret =
      process.env.CLERK_WEBHOOK_SIGNING_SECRET;

    if (!signingSecret) {
      console.error(
        "Clerk webhook: signing secret is missing."
      );

      return new Response(
        "Webhook signing secret missing",
        {
          status: 500,
        }
      );
    }

    const svixId =
      req.headers.get("svix-id");

    const svixTimestamp =
      req.headers.get("svix-timestamp");

    const svixSignature =
      req.headers.get("svix-signature");

    if (
      !svixId ||
      !svixTimestamp ||
      !svixSignature
    ) {
      console.error(
        "Clerk webhook: missing Svix headers."
      );

      return new Response(
        "Missing webhook headers",
        {
          status: 400,
        }
      );
    }

    const webhook =
      new Webhook(signingSecret);

    /*
     * Svix verification.
     *
     * We cast the verifier itself to any because
     * the installed Svix TypeScript definitions are
     * conflicting with the supported verify() call.
     */
    const evt = (webhook as any).verify(
      body,
      {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      }
    ) as {
      type: string;
      data: {
        user_id?: string;
      };
    };

    if (
      evt.type !== "session.created"
    ) {
      return new Response(
        "Event ignored",
        {
          status: 200,
        }
      );
    }

    const userId =
      evt.data?.user_id;

    if (!userId) {
      console.error(
        "Clerk webhook: user ID missing."
      );

      return new Response(
        "User ID missing",
        {
          status: 400,
        }
      );
    }

    const client =
      await clerkClient();

    const user =
      await client.users.getUser(
        userId
      );

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

    const emailResult =
      await sendEmail({
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