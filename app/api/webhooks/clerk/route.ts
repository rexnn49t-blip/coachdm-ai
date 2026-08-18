import { NextRequest } from "next/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    console.log("CLERK WEBHOOK EVENT:", {
      type: evt.type,
      data: evt.data,
    });

    return new Response("Webhook received", {
      status: 200,
    });
  } catch (error) {
    console.error("Clerk webhook error:", error);

    return new Response("Webhook verification failed", {
      status: 400,
    });
  }
}