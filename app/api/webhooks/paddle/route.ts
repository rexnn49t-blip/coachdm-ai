import { NextRequest, NextResponse } from "next/server";
import { EventName } from "@paddle/paddle-node-sdk";

import { paddle } from "@/lib/paddle";
import { updateSubscription } from "@/lib/subscription-db";

export async function POST(req: NextRequest) {
  try {
    // Paddle requires the ORIGINAL raw request body
    // for signature verification.
    const rawBody = await req.text();

    const signature = req.headers.get("paddle-signature");

    if (!signature) {
      console.error("Paddle webhook signature missing.");

      return NextResponse.json(
        {
          error: "Missing Paddle signature.",
        },
        {
          status: 400,
        }
      );
    }

    const webhookSecret =
      process.env.PADDLE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error(
        "PADDLE_WEBHOOK_SECRET is not configured."
      );

      return NextResponse.json(
        {
          error: "Webhook secret is not configured.",
        },
        {
          status: 500,
        }
      );
    }

    /*
     * Verify the Paddle signature and parse
     * the webhook event.
     */
    const eventData =
      await paddle.webhooks.unmarshal(
        rawBody,
        webhookSecret,
        signature
      );

    console.log(
      "Paddle webhook received:",
      eventData.eventType
    );

    const data = eventData.data as any;

    /*
     * Paddle custom data contains the Clerk user ID
     * that we sent when creating the checkout.
     */
    const clerkUserId =
      data?.customData?.clerk_user_id ?? null;

    /*
     * -----------------------------------------
     * SUBSCRIPTION CREATED
     * -----------------------------------------
     */
    if (
      eventData.eventType ===
      EventName.SubscriptionCreated
    ) {
      if (!clerkUserId) {
        console.error(
          "No clerk_user_id found in subscription.created."
        );

        return NextResponse.json(
          {
            error:
              "Missing clerk_user_id in subscription data.",
          },
          {
            status: 400,
          }
        );
      }

      const priceId =
        data?.items?.[0]?.price?.id ?? null;

      const currentBillingPeriod =
        data?.currentBillingPeriod ?? null;

      await updateSubscription(
        clerkUserId,
        {
          email:
            data?.customData?.email ?? null,

          plan: "pro",

          status:
            data?.status ?? "active",

          paddle_customer_id:
            data?.customerId ?? null,

          paddle_subscription_id:
            data?.id ?? null,

          paddle_price_id:
            priceId,

          current_period_start:
            currentBillingPeriod?.startsAt ??
            null,

          current_period_end:
            currentBillingPeriod?.endsAt ??
            null,

          cancel_at_period_end: false,
        }
      );

      console.log(
        "Subscription created and upgraded to PRO:",
        clerkUserId
      );

      return NextResponse.json({
        success: true,
      });
    }

    /*
     * -----------------------------------------
     * SUBSCRIPTION ACTIVATED
     * -----------------------------------------
     *
     * This is the event we saw in your
     * Paddle notification log.
     */
    if (
      eventData.eventType ===
      EventName.SubscriptionActivated
    ) {
      if (!clerkUserId) {
        console.error(
          "No clerk_user_id found in subscription.activated."
        );

        return NextResponse.json(
          {
            error:
              "Missing clerk_user_id in activated subscription.",
          },
          {
            status: 400,
          }
        );
      }

      const priceId =
        data?.items?.[0]?.price?.id ?? null;

      const currentBillingPeriod =
        data?.currentBillingPeriod ?? null;

      await updateSubscription(
        clerkUserId,
        {
          plan: "pro",

          status:
            data?.status ?? "active",

          paddle_customer_id:
            data?.customerId ?? null,

          paddle_subscription_id:
            data?.id ?? null,

          paddle_price_id:
            priceId,

          current_period_start:
            currentBillingPeriod?.startsAt ??
            null,

          current_period_end:
            currentBillingPeriod?.endsAt ??
            null,

          cancel_at_period_end: false,
        }
      );

      console.log(
        "Subscription activated and upgraded to PRO:",
        clerkUserId
      );

      return NextResponse.json({
        success: true,
      });
    }

    /*
     * -----------------------------------------
     * SUBSCRIPTION UPDATED
     * -----------------------------------------
     *
     * Handles:
     * - renewals
     * - plan changes
     * - pauses
     * - resumes
     * - scheduled cancellations
     */
    if (
      eventData.eventType ===
      EventName.SubscriptionUpdated
    ) {
      if (!clerkUserId) {
        console.error(
          "No clerk_user_id found in subscription.updated."
        );

        return NextResponse.json(
          {
            error:
              "Missing clerk_user_id in updated subscription.",
          },
          {
            status: 400,
          }
        );
      }

      const priceId =
        data?.items?.[0]?.price?.id ?? null;

      const currentBillingPeriod =
        data?.currentBillingPeriod ?? null;

      const cancelAtPeriodEnd =
        data?.scheduledChange?.action ===
        "cancel";

      await updateSubscription(
        clerkUserId,
        {
          plan:
            data?.status === "canceled"
              ? "free"
              : "pro",

          status:
            data?.status ?? "active",

          paddle_customer_id:
            data?.customerId ?? null,

          paddle_subscription_id:
            data?.id ?? null,

          paddle_price_id:
            priceId,

          current_period_start:
            currentBillingPeriod?.startsAt ??
            null,

          current_period_end:
            currentBillingPeriod?.endsAt ??
            null,

          cancel_at_period_end:
            cancelAtPeriodEnd,
        }
      );

      console.log(
        "Subscription updated:",
        clerkUserId,
        data?.status
      );

      return NextResponse.json({
        success: true,
      });
    }

    /*
     * -----------------------------------------
     * SUBSCRIPTION CANCELED
     * -----------------------------------------
     */
    if (
      eventData.eventType ===
      EventName.SubscriptionCanceled
    ) {
      if (!clerkUserId) {
        console.error(
          "No clerk_user_id found in subscription.canceled."
        );

        return NextResponse.json(
          {
            error:
              "Missing clerk_user_id in canceled subscription.",
          },
          {
            status: 400,
          }
        );
      }

      const priceId =
        data?.items?.[0]?.price?.id ?? null;

      const currentBillingPeriod =
        data?.currentBillingPeriod ?? null;

      await updateSubscription(
        clerkUserId,
        {
          plan: "free",

          status: "canceled",

          paddle_customer_id:
            data?.customerId ?? null,

          paddle_subscription_id:
            data?.id ?? null,

          paddle_price_id:
            priceId,

          current_period_start:
            currentBillingPeriod?.startsAt ??
            null,

          current_period_end:
            currentBillingPeriod?.endsAt ??
            null,

          cancel_at_period_end: true,
        }
      );

      console.log(
        "Subscription canceled:",
        clerkUserId
      );

      return NextResponse.json({
        success: true,
      });
    }

    /*
     * -----------------------------------------
     * TRANSACTION COMPLETED
     * -----------------------------------------
     *
     * Payment completed successfully.
     * The subscription activation event is
     * responsible for upgrading the account.
     */
    if (
      eventData.eventType ===
      EventName.TransactionCompleted
    ) {
      console.log(
        "Paddle transaction completed:",
        data?.id
      );

      return NextResponse.json({
        success: true,
      });
    }

    /*
     * -----------------------------------------
     * OTHER EVENTS
     * -----------------------------------------
     */
    console.log(
      "Unhandled Paddle event:",
      eventData.eventType
    );

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "========== PADDLE WEBHOOK ERROR =========="
    );

    console.error(error);

    console.error(
      "==========================================="
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Invalid or failed Paddle webhook.",
      },
      {
        status: 400,
      }
    );
  }
}