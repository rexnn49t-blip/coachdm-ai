import { NextRequest, NextResponse } from "next/server";
import { EventName } from "@paddle/paddle-node-sdk";

import { paddle } from "@/lib/paddle";
import { updateSubscription } from "@/lib/subscription-db";

export async function POST(req: NextRequest) {
  try {
    // Paddle requires the ORIGINAL raw request body
    // for webhook signature verification.
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
     * Verify the webhook signature AND parse the event.
     *
     * Never trust Paddle webhook data before this succeeds.
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

    /*
     * We intentionally use the event data here.
     *
     * Paddle's SDK gives us strongly typed events, but keeping
     * the subscription data handling flexible prevents SDK
     * type changes from affecting the database mapping.
     */
    const data = eventData.data as any;

    switch (eventData.eventType) {
      /*
       * -----------------------------------------
       * SUBSCRIPTION CREATED
       * -----------------------------------------
       */
      case EventName.SubscriptionCreated: {
        const clerkUserId =
          data?.customData?.clerk_user_id;

        if (!clerkUserId) {
          console.error(
            "No clerk_user_id found in Paddle subscription custom data."
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

        const email =
          data?.customData?.email ??
          null;

        const currentBillingPeriod =
          data?.currentBillingPeriod ?? null;

        await updateSubscription(
          clerkUserId,
          {
            email,
            plan: "PRO",
            status: data?.status ?? "active",

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

        break;
      }

      /*
       * -----------------------------------------
       * SUBSCRIPTION UPDATED
       * -----------------------------------------
       *
       * This handles:
       * - renewals
       * - plan changes
       * - pauses
       * - resumes
       * - cancellations
       * - billing-period changes
       */
      case EventName.SubscriptionUpdated: {
        const clerkUserId =
          data?.customData?.clerk_user_id;

        if (!clerkUserId) {
          console.error(
            "No clerk_user_id found in updated subscription."
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

        const cancelAtPeriodEnd =
          data?.scheduledChange?.action ===
          "cancel";

        await updateSubscription(
          clerkUserId,
          {
            plan:
              data?.status === "canceled"
                ? "FREE"
                : "PRO",

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

        break;
      }

      /*
       * -----------------------------------------
       * SUBSCRIPTION CANCELED
       * -----------------------------------------
       */
      case EventName.SubscriptionCanceled: {
        const clerkUserId =
          data?.customData?.clerk_user_id;

        if (!clerkUserId) {
          console.error(
            "No clerk_user_id found in canceled subscription."
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

        await updateSubscription(
          clerkUserId,
          {
            plan: "FREE",
            status: "canceled",

            paddle_customer_id:
              data?.customerId ?? null,

            paddle_subscription_id:
              data?.id ?? null,

            paddle_price_id:
              data?.items?.[0]?.price?.id ??
              null,

            current_period_start:
              data?.currentBillingPeriod
                ?.startsAt ?? null,

            current_period_end:
              data?.currentBillingPeriod
                ?.endsAt ?? null,

            cancel_at_period_end: true,
          }
        );

        console.log(
          "Subscription canceled:",
          clerkUserId
        );

        break;
      }

      /*
       * -----------------------------------------
       * TRANSACTION COMPLETED
       * -----------------------------------------
       *
       * We don't upgrade the user here because
       * subscription.created is responsible for
       * provisioning the recurring subscription.
       *
       * This event is useful for payment confirmation
       * and future billing analytics.
       */
      case EventName.TransactionCompleted: {
        console.log(
          "Paddle transaction completed:",
          data?.id
        );

        break;
      }

      /*
       * -----------------------------------------
       * OTHER EVENTS
       * -----------------------------------------
       */
      default: {
        console.log(
          "Unhandled Paddle event:",
          eventData.eventType
        );
      }
    }

    /*
     * Always acknowledge successfully processed
     * Paddle notifications.
     */
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

    /*
     * Returning 400 tells Paddle that this webhook
     * was not successfully processed.
     */
    return NextResponse.json(
      {
        success: false,
        error: "Invalid or failed Paddle webhook.",
      },
      {
        status: 400,
      }
    );
  }
}