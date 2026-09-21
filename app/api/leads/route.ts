import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import {
  createLead,
  getLeads,
} from "@/lib/leads";

import { isPro } from "@/lib/subscription-db";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const leads =
      await getLeads(userId);

    return NextResponse.json({
      leads,
    });
  } catch (error) {
    console.error(
      "Get leads API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to fetch leads.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(
  req: NextRequest
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const body = await req.json();

    if (
      !body.name ||
      !body.name.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "Lead name is required.",
        },
        {
          status: 400,
        }
      );
    }

    // Free users can have only 1 lead.
    // Pro users can create unlimited leads.
    const pro = await isPro(userId);

    if (!pro) {
      const existingLeads =
        await getLeads(userId);

      if (existingLeads.length >= 1) {
        return NextResponse.json(
          {
            error:
              "Free plan allows 1 lead. Upgrade to Pro to add unlimited leads.",
            code: "LEAD_LIMIT_REACHED",
          },
          {
            status: 403,
          }
        );
      }
    }

    const lead =
      await createLead(
        userId,
        {
          name: body.name,
          email: body.email,
          phone: body.phone,
          source: body.source,
          goal: body.goal,
          initial_message:
            body.initial_message,
          notes: body.notes,
        }
      );

    if (!lead) {
      return NextResponse.json(
        {
          error:
            "Failed to create lead.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        lead,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "Create lead API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to create lead.",
      },
      {
        status: 500,
      }
    );
  }
}