import { NextRequest, NextResponse } from "next/server";
import { EventName } from "@paddle/paddle-node-sdk";

import { paddle } from "@/lib/paddle";

import {
  getSubscription,
  updateSubscription,
} from "@/lib/subscription-db";

import { sendEmail } from "@/lib/send-email";

import {
  proUpgradeEmail,
  subscriptionUpdatedEmail,
  subscriptionDowngradedEmail,
  subscriptionCancelledEmail,
  subscriptionReactivatedEmail,
  subscriptionRenewedEmail,
} from "@/lib/email-templates";

/**
 * Send a subscription notification email.
 */
async function sendSubscriptionEmail({
  email,
  subject,
  html,
}: {
  email: string | null | undefined;
  subject: string;
  html: string;
}) {
  if (!email) {
    console.log(
      "Subscription email skipped: no email address."
    );

    return;
  }

  const result = await sendEmail({
    to: email,
    subject,
    html,
  });

  if (!result.success) {
    console.error(
      "Subscription notification email failed:",
      result.error
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    /*
     * Paddle requires the ORIGINAL raw request body
     * for signature verification.
     */
    const rawBody = await req.text();

    const signature =
      req.headers.get("paddle-signature");

    if (!signature) {
      console.error(
        "Paddle webhook signature missing."
      );

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
          error:
            "Webhook secret is not configured.",
        },
        {
          status: 500,
        }
      );
    }

    /*
     * Verify Paddle webhook.
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
     * Get Clerk user ID from Paddle custom data.
     */
    const clerkUserId =
      data?.customData?.clerk_user_id ?? null;

    /*
     * Get previous subscription BEFORE updating it.
     */
    const previousSubscription =
      clerkUserId
        ? await getSubscription(clerkUserId)
        : null;

    /*
     * Get email from Paddle first.
     * Fall back to Supabase.
     */
    const email =
      data?.customData?.email ??
      previousSubscription?.email ??
      null;

    /*
     * =================================================
     * SUBSCRIPTION CREATED
     * =================================================
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

      const updatedSubscription =
        await updateSubscription(
          clerkUserId,
          {
            email,

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

      if (!updatedSubscription) {
        return NextResponse.json(
          {
            error:
              "Failed to update subscription.",
          },
          {
            status: 500,
          }
        );
      }

      /*
       * Only send upgrade email if the user
       * wasn't already Pro.
       */
      if (
        previousSubscription?.plan !== "pro"
      ) {
        const html = proUpgradeEmail({
          firstName: "there",
        });

        await sendSubscriptionEmail({
          email,
          subject:
            "Welcome to CoachDM Pro",
          html,
        });
      }

      console.log(
        "Subscription created and upgraded to PRO:",
        clerkUserId
      );

      return NextResponse.json({
        success: true,
      });
    }

    /*
     * =================================================
     * SUBSCRIPTION ACTIVATED
     * =================================================
     *
     * We intentionally do NOT send another
     * upgrade email here because subscription.created
     * already handles it.
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

      const updatedSubscription =
        await updateSubscription(
          clerkUserId,
          {
            email,

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

      if (!updatedSubscription) {
        return NextResponse.json(
          {
            error:
              "Failed to update activated subscription.",
          },
          {
            status: 500,
          }
        );
      }

      console.log(
        "Subscription activated:",
        clerkUserId
      );

      return NextResponse.json({
        success: true,
      });
    }

    /*
     * =================================================
     * SUBSCRIPTION UPDATED
     * =================================================
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

      const newStatus =
        data?.status ?? "active";

      const newPlan =
        newStatus === "canceled"
          ? "free"
          : "pro";

      /*
       * Was the user previously Pro?
       */
      const wasPro =
        previousSubscription?.plan ===
          "pro" &&
        ["active", "trialing"].includes(
          previousSubscription.status.toLowerCase()
        );

      /*
       * Is the user currently Pro?
       */
      const isNowPro =
        newPlan === "pro" &&
        ["active", "trialing"].includes(
          newStatus.toLowerCase()
        );

      /*
       * Detect renewal.
       */
      const previousPeriodEnd =
        previousSubscription
          ?.current_period_end;

      const newPeriodEnd =
        currentBillingPeriod?.endsAt ??
        null;

      const isRenewal =
        wasPro &&
        isNowPro &&
        !!previousPeriodEnd &&
        !!newPeriodEnd &&
        new Date(newPeriodEnd).getTime() >
          new Date(previousPeriodEnd).getTime();

      /*
       * Update subscription.
       */
      const updatedSubscription =
        await updateSubscription(
          clerkUserId,
          {
            email,

            plan: newPlan,

            status: newStatus,

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

      if (!updatedSubscription) {
        return NextResponse.json(
          {
            error:
              "Failed to update subscription.",
          },
          {
            status: 500,
          }
        );
      }

      /*
       * -----------------------------------------
       * PRO → FREE
       * -----------------------------------------
       */
      if (wasPro && !isNowPro) {
        const html =
          subscriptionDowngradedEmail({
            firstName: "there",
          });

        await sendSubscriptionEmail({
          email,
          subject:
            "Your CoachDM plan was changed",
          html,
        });
      }

      /*
       * -----------------------------------------
       * FREE → PRO
       * -----------------------------------------
       */
      else if (!wasPro && isNowPro) {
        const html =
          subscriptionReactivatedEmail({
            firstName: "there",
          });

        await sendSubscriptionEmail({
          email,
          subject:
            "Your CoachDM Pro subscription is active again",
          html,
        });
      }

      /*
       * -----------------------------------------
       * PRO RENEWAL
       * -----------------------------------------
       */
      else if (isRenewal) {
        const html =
          subscriptionRenewedEmail({
            firstName: "there",
          });

        await sendSubscriptionEmail({
          email,
          subject:
            "Your CoachDM subscription was renewed",
          html,
        });
      }

      /*
       * -----------------------------------------
       * NORMAL UPDATE
       * -----------------------------------------
       */
      else {
        const html =
          subscriptionUpdatedEmail({
            firstName: "there",
          });

        await sendSubscriptionEmail({
          email,
          subject:
            "Your CoachDM subscription was updated",
          html,
        });
      }

      console.log(
        "Subscription updated:",
        clerkUserId,
        newStatus
      );

      return NextResponse.json({
        success: true,
      });
    }

    /*
     * =================================================
     * SUBSCRIPTION CANCELED
     * =================================================
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

      const updatedSubscription =
        await updateSubscription(
          clerkUserId,
          {
            email,

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

      if (!updatedSubscription) {
        return NextResponse.json(
          {
            error:
              "Failed to update canceled subscription.",
          },
          {
            status: 500,
          }
        );
      }

      const html =
        subscriptionCancelledEmail({
          firstName: "there",
        });

      await sendSubscriptionEmail({
        email,
        subject:
          "Your CoachDM subscription was cancelled",
        html,
      });

      console.log(
        "Subscription canceled:",
        clerkUserId
      );

      return NextResponse.json({
        success: true,
      });
    }

    /*
     * =================================================
     * TRANSACTION COMPLETED
     * =================================================
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
     * =================================================
     * OTHER EVENTS
     * =================================================
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