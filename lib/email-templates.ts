const BRAND_NAME = "CoachDM AI";

const BRAND_COLOR = "#8b5cf6";

function emailLayout({
  title,
  preview,
  content,
}: {
  title: string;
  preview: string;
  content: string;
}) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />
  <title>${title}</title>
</head>

<body
  style="
    margin:0;
    padding:0;
    background:#09090b;
    font-family:Arial,Helvetica,sans-serif;
    color:#ffffff;
  "
>
  <div style="display:none;max-height:0;overflow:hidden;">
    ${preview}
  </div>

  <table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    style="background:#09090b;padding:40px 16px;"
  >
    <tr>
      <td align="center">

        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          style="
            max-width:600px;
            background:#111113;
            border:1px solid #27272a;
            border-radius:20px;
            overflow:hidden;
          "
        >

          <!-- Header -->

          <tr>
            <td
              style="
                padding:28px 32px;
                border-bottom:1px solid #27272a;
              "
            >
              <div
                style="
                  font-size:22px;
                  font-weight:700;
                  color:#ffffff;
                "
              >
                ${BRAND_NAME}
              </div>

              <div
                style="
                  margin-top:6px;
                  font-size:13px;
                  color:#a1a1aa;
                "
              >
                AI-powered conversations for coaches
              </div>
            </td>
          </tr>

          <!-- Content -->

          <tr>
            <td style="padding:36px 32px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->

          <tr>
            <td
              style="
                padding:24px 32px;
                border-top:1px solid #27272a;
                color:#71717a;
                font-size:12px;
                line-height:1.6;
              "
            >
              You're receiving this email because of activity
              on your ${BRAND_NAME} account.
              <br /><br />

              © ${new Date().getFullYear()} ${BRAND_NAME}
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>
`;
}

/* -------------------------------------------------------
   LOGIN
------------------------------------------------------- */

export function loginNotificationEmail({
  firstName,
}: {
  firstName?: string | null;
}) {
  const name = firstName || "there";

  return emailLayout({
    title: "New sign-in to your CoachDM AI account",
    preview: "Your CoachDM AI account was just accessed.",
    content: `
      <h1
        style="
          margin:0;
          font-size:28px;
          line-height:1.3;
        "
      >
        Welcome back, ${name} 👋
      </h1>

      <p
        style="
          margin-top:18px;
          color:#a1a1aa;
          font-size:15px;
          line-height:1.7;
        "
      >
        Your CoachDM AI account was just signed in to.
      </p>

      <div
        style="
          margin-top:24px;
          padding:18px;
          background:#18181b;
          border:1px solid #27272a;
          border-radius:14px;
        "
      >
        <strong style="color:#ffffff;">
          Sign-in detected
        </strong>

        <p
          style="
            margin:8px 0 0;
            color:#a1a1aa;
            font-size:14px;
          "
        >
          If this was you, there's nothing you need to do.
        </p>
      </div>

      <p
        style="
          margin-top:24px;
          color:#a1a1aa;
          font-size:14px;
          line-height:1.7;
        "
      >
        If you don't recognize this activity, please secure
        your account immediately.
      </p>
    `,
  });
}

/* -------------------------------------------------------
   WELCOME
------------------------------------------------------- */

export function welcomeEmail({
  firstName,
}: {
  firstName?: string | null;
}) {
  const name = firstName || "there";

  return emailLayout({
    title: "Welcome to CoachDM AI",
    preview: "Your CoachDM AI account is ready.",
    content: `
      <h1
        style="
          margin:0;
          font-size:28px;
        "
      >
        Welcome to CoachDM AI, ${name}! 🎉
      </h1>

      <p
        style="
          margin-top:18px;
          color:#a1a1aa;
          font-size:15px;
          line-height:1.7;
        "
      >
        Your account is ready. CoachDM AI helps you create
        personalized replies to leads so you can spend less
        time writing messages and more time coaching.
      </p>

      <a
        href="${process.env.NEXT_PUBLIC_APP_URL ?? "#"}"
        style="
          display:inline-block;
          margin-top:24px;
          padding:14px 22px;
          background:${BRAND_COLOR};
          color:#ffffff;
          text-decoration:none;
          border-radius:10px;
          font-weight:600;
        "
      >
        Open CoachDM AI
      </a>
    `,
  });
}

/* -------------------------------------------------------
   SUBSCRIPTION CREATED / UPGRADE
------------------------------------------------------- */

export function proUpgradeEmail({
  firstName,
}: {
  firstName?: string | null;
}) {
  const name = firstName || "there";

  return emailLayout({
    title: "Welcome to CoachDM Pro",
    preview: "Your CoachDM Pro subscription is active.",
    content: `
      <h1 style="margin:0;font-size:28px;">
        You're now on Pro 🚀
      </h1>

      <p
        style="
          margin-top:18px;
          color:#a1a1aa;
          font-size:15px;
          line-height:1.7;
        "
      >
        Hi ${name}, your CoachDM Pro subscription is now active.
      </p>

      <div
        style="
          margin-top:24px;
          padding:20px;
          background:#18181b;
          border:1px solid #3f3f46;
          border-radius:14px;
        "
      >
        <div
          style="
            color:#a78bfa;
            font-weight:700;
            font-size:16px;
          "
        >
          CoachDM Pro
        </div>

        <p
          style="
            margin:8px 0 0;
            color:#a1a1aa;
            font-size:14px;
          "
        >
          Unlimited AI reply generation and access to
          Pro features.
        </p>
      </div>

      <p
        style="
          margin-top:24px;
          color:#a1a1aa;
          font-size:14px;
        "
      >
        Thanks for choosing CoachDM AI.
      </p>
    `,
  });
}

/* -------------------------------------------------------
   SUBSCRIPTION UPDATED
------------------------------------------------------- */

export function subscriptionUpdatedEmail({
  firstName,
}: {
  firstName?: string | null;
}) {
  return emailLayout({
    title: "Your CoachDM subscription was updated",
    preview: "Your subscription details have changed.",
    content: `
      <h1 style="margin:0;font-size:28px;">
        Subscription updated
      </h1>

      <p
        style="
          margin-top:18px;
          color:#a1a1aa;
          font-size:15px;
          line-height:1.7;
        "
      >
        Hi ${firstName || "there"}, your CoachDM AI
        subscription has been updated successfully.
      </p>
    `,
  });
}

/* -------------------------------------------------------
   DOWNGRADED
------------------------------------------------------- */

export function subscriptionDowngradedEmail({
  firstName,
}: {
  firstName?: string | null;
}) {
  return emailLayout({
    title: "Your CoachDM plan was changed",
    preview: "Your CoachDM subscription is now on the Free plan.",
    content: `
      <h1 style="margin:0;font-size:28px;">
        Your plan has changed
      </h1>

      <p
        style="
          margin-top:18px;
          color:#a1a1aa;
          font-size:15px;
          line-height:1.7;
        "
      >
        Hi ${firstName || "there"}, your CoachDM AI
        subscription has been changed to the Free plan.
      </p>

      <p
        style="
          margin-top:18px;
          color:#a1a1aa;
          font-size:14px;
          line-height:1.7;
        "
      >
        You can upgrade again at any time if you need
        unlimited AI replies.
      </p>
    `,
  });
}

/* -------------------------------------------------------
   CANCELLED
------------------------------------------------------- */

export function subscriptionCancelledEmail({
  firstName,
}: {
  firstName?: string | null;
}) {
  return emailLayout({
    title: "Your CoachDM subscription was cancelled",
    preview: "Your CoachDM subscription has been cancelled.",
    content: `
      <h1 style="margin:0;font-size:28px;">
        Subscription cancelled
      </h1>

      <p
        style="
          margin-top:18px;
          color:#a1a1aa;
          font-size:15px;
          line-height:1.7;
        "
      >
        Hi ${firstName || "there"}, your CoachDM AI
        subscription has been cancelled.
      </p>

      <p
        style="
          margin-top:18px;
          color:#a1a1aa;
          font-size:14px;
        "
      >
        We're sorry to see you go. You can resubscribe
        whenever you're ready.
      </p>
    `,
  });
}

/* -------------------------------------------------------
   REACTIVATED
------------------------------------------------------- */

export function subscriptionReactivatedEmail({
  firstName,
}: {
  firstName?: string | null;
}) {
  return emailLayout({
    title: "Your CoachDM subscription is active again",
    preview: "Your CoachDM Pro subscription has been reactivated.",
    content: `
      <h1 style="margin:0;font-size:28px;">
        Welcome back 🚀
      </h1>

      <p
        style="
          margin-top:18px;
          color:#a1a1aa;
          font-size:15px;
          line-height:1.7;
        "
      >
        Hi ${firstName || "there"}, your CoachDM AI
        subscription has been reactivated.
      </p>

      <p
        style="
          margin-top:18px;
          color:#a1a1aa;
          font-size:14px;
        "
      >
        Your Pro access is active again.
      </p>
    `,
  });
}

/* -------------------------------------------------------
   PAYMENT FAILED
------------------------------------------------------- */

export function paymentFailedEmail({
  firstName,
}: {
  firstName?: string | null;
}) {
  return emailLayout({
    title: "Payment failed",
    preview: "We couldn't process your CoachDM payment.",
    content: `
      <h1 style="margin:0;font-size:28px;">
        Payment failed
      </h1>

      <p
        style="
          margin-top:18px;
          color:#a1a1aa;
          font-size:15px;
          line-height:1.7;
        "
      >
        Hi ${firstName || "there"}, we couldn't process
        your latest CoachDM AI subscription payment.
      </p>

      <p
        style="
          margin-top:18px;
          color:#a1a1aa;
          font-size:14px;
          line-height:1.7;
        "
      >
        Please check your payment method and update it
        if necessary.
      </p>
    `,
  });
}

/* -------------------------------------------------------
   RENEWED
------------------------------------------------------- */

export function subscriptionRenewedEmail({
  firstName,
}: {
  firstName?: string | null;
}) {
  return emailLayout({
    title: "Your CoachDM subscription was renewed",
    preview: "Your CoachDM Pro subscription has been renewed.",
    content: `
      <h1 style="margin:0;font-size:28px;">
        Subscription renewed ✨
      </h1>

      <p
        style="
          margin-top:18px;
          color:#a1a1aa;
          font-size:15px;
          line-height:1.7;
        "
      >
        Hi ${firstName || "there"}, your CoachDM AI
        subscription has been successfully renewed.
      </p>

      <p
        style="
          margin-top:18px;
          color:#a1a1aa;
          font-size:14px;
        "
      >
        Your Pro access continues uninterrupted.
      </p>
    `,
  });
}

/* -------------------------------------------------------
   ADMIN UPGRADE
------------------------------------------------------- */

export function adminUpgradeEmail({
  firstName,
}: {
  firstName?: string | null;
}) {
  return emailLayout({
    title: "Your CoachDM account was upgraded",
    preview: "An administrator upgraded your CoachDM account.",
    content: `
      <h1 style="margin:0;font-size:28px;">
        Your account was upgraded 🚀
      </h1>

      <p
        style="
          margin-top:18px;
          color:#a1a1aa;
          font-size:15px;
          line-height:1.7;
        "
      >
        Hi ${firstName || "there"}, an administrator has
        upgraded your CoachDM AI account to Pro.
      </p>

      <p
        style="
          margin-top:18px;
          color:#a1a1aa;
          font-size:14px;
        "
      >
        Your Pro features are now available.
      </p>
    `,
  });
}

/* -------------------------------------------------------
   ADMIN DOWNGRADE
------------------------------------------------------- */

export function adminDowngradeEmail({
  firstName,
}: {
  firstName?: string | null;
}) {
  return emailLayout({
    title: "Your CoachDM account was changed",
    preview: "An administrator changed your CoachDM plan.",
    content: `
      <h1 style="margin:0;font-size:28px;">
        Your plan was changed
      </h1>

      <p
        style="
          margin-top:18px;
          color:#a1a1aa;
          font-size:15px;
          line-height:1.7;
        "
      >
        Hi ${firstName || "there"}, an administrator has
        changed your CoachDM AI account to the Free plan.
      </p>

      <p
        style="
          margin-top:18px;
          color:#a1a1aa;
          font-size:14px;
        "
      >
        You can upgrade again whenever you need Pro access.
      </p>
    `,
  });
}