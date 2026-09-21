import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

const refinementInstructions: Record<string, string> = {
  specific: `
Make the potential client profiles more specific.

Focus on:
- Clearer situations and circumstances
- More specific problems
- More distinct client profiles
- Stronger connection between the profile and the coach's niche
- Avoid generic or interchangeable suggestions
`,

  high_value: `
Focus on potential client profiles who may have stronger alignment with a premium coaching service.

Focus on:
- Clear and meaningful problems
- Strong motivation to solve those problems
- Situations where professional coaching could reasonably provide meaningful value
- Profiles that could potentially be suitable for a higher-value coaching offer

Do not make claims about a person's income, wealth, or ability to pay.
Do not invent financial information.
`,

  different_angle: `
Generate the profiles from a different perspective than the previous results.

Explore:
- Different situations
- Different motivations
- Different types of potential clients
- Less obvious but still relevant client profiles
- New conversation opportunities

Avoid simply rewriting the same profiles with different wording.
`,
};

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const niche = String(body?.niche || "").trim();
    const idealClient = String(body?.idealClient || "").trim();
    const goal = String(body?.goal || "").trim();
    const location = String(body?.location || "").trim();

    const count = Math.min(
      Math.max(Number(body?.count) || 5, 1),
      10
    );

    const refinement = String(
      body?.refinement || ""
    ).trim();

    if (!niche || !idealClient) {
      return NextResponse.json(
        {
          error:
            "Coaching niche and ideal client are required.",
        },
        { status: 400 }
      );
    }

    const refinementInstruction =
      refinementInstructions[refinement] || "";

    const prompt = `
You are an AI lead research assistant for coaches.

Your job is to generate realistic POTENTIAL CLIENT PROFILES based on the coach's target audience.

Important:
- Do NOT scrape or invent real people's private information.
- Do NOT provide personal phone numbers, email addresses, social-media handles, or other personal contact information.
- Do NOT suggest unsolicited mass outreach.
- Generate useful prospect PROFILE IDEAS that a coach can manually evaluate.
- The coach remains responsible for deciding who to contact.
- Do not claim that these are verified real people.
- Keep the suggestions practical and relevant.

Coach niche:
${niche}

Ideal client:
${idealClient}

Client goal/problem:
${goal || "Not specified"}

Location:
${location || "Not specified"}

${
  refinementInstruction
    ? `
REFINEMENT REQUEST:
${refinementInstruction}

The refinement should meaningfully affect the generated profiles.
Do not simply repeat generic profiles.
`
    : ""
}

Generate exactly ${count} potential client profile ideas.

For each profile provide:
1. name — a generic descriptive label, not a claimed real person's identity
2. profile — a short description of the potential client's situation
3. goal — their likely goal or problem
4. whyFit — why this type of person may be relevant to the coach
5. conversationAngle — a natural, non-pushy conversation topic the coach could use if they already have a legitimate opportunity to speak with this type of person

Return ONLY valid JSON in this exact format:

{
  "leads": [
    {
      "name": "Example Prospect Profile",
      "profile": "Description",
      "goal": "Likely goal",
      "whyFit": "Why they may be a fit",
      "conversationAngle": "Suggested conversation angle"
    }
  ]
}
`;

    const completion = await openai.chat.completions.create({
      model: "openai/gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "You generate structured potential-client profile ideas for coaching businesses. Return valid JSON only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: refinement ? 0.8 : 0.7,
      max_tokens: 2500,
    });

    const content =
      completion.choices[0]?.message?.content?.trim();

    if (!content) {
      return NextResponse.json(
        {
          error:
            "The AI did not return any lead ideas.",
        },
        { status: 500 }
      );
    }

    let parsed: {
      leads?: Array<{
        name?: string;
        profile?: string;
        goal?: string;
        whyFit?: string;
        conversationAngle?: string;
      }>;
    };

    try {
      parsed = JSON.parse(content);
    } catch {
      console.error(
        "Lead Generator JSON parse error:",
        content
      );

      return NextResponse.json(
        {
          error:
            "The AI returned an invalid response. Please try again.",
        },
        { status: 500 }
      );
    }

    const leads = Array.isArray(parsed.leads)
      ? parsed.leads
          .map((lead) => ({
            name: String(lead?.name || "").trim(),
            profile: String(
              lead?.profile || ""
            ).trim(),
            goal: String(
              lead?.goal || ""
            ).trim(),
            whyFit: String(
              lead?.whyFit || ""
            ).trim(),
            conversationAngle: String(
              lead?.conversationAngle || ""
            ).trim(),
          }))
          .filter(
            (lead) =>
              lead.name &&
              lead.profile &&
              lead.goal &&
              lead.whyFit &&
              lead.conversationAngle
          )
          .slice(0, count)
      : [];

    if (leads.length === 0) {
      return NextResponse.json(
        {
          error:
            "No usable lead ideas were generated. Please try again.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      leads,
    });
  } catch (error) {
    console.error(
      "Generate leads API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to generate lead ideas right now. Please try again.",
      },
      { status: 500 }
    );
  }
}