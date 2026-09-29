import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

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

    /*
    -----------------------------------------------------
    Prospect count
    Default: 2
    Allowed: 1-2
    -----------------------------------------------------
    */

    const requestedCount = Number(body?.count);

    const count =
      requestedCount === 1 || requestedCount === 2
        ? requestedCount
        : 2;

    /*
    =====================================================
    VALIDATION
    =====================================================
    */

    if (!niche || !idealClient) {
      return NextResponse.json(
        {
          error:
            "Coaching niche and ideal client are required.",
        },
        { status: 400 }
      );
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        {
          error:
            "OpenRouter API key is not configured.",
        },
        { status: 500 }
      );
    }

    /*
    =====================================================
    REAL WEB PROSPECT RESEARCH
    =====================================================

    The AI searches publicly available web information
    for real potential clients.

    IMPORTANT:
    Quality is more important than quantity.

    Maximum:
    - 2 prospects
    - 2 web-search tool calls
    - 10 cumulative search results
    =====================================================
    */

    const researchPrompt = `
You are the AI Lead Discovery and Screening Assistant
for CoachDM AI.

CoachDM helps coaches identify REAL potential clients
from publicly available information and start genuine,
personalized conversations.

Your task is to research the public web and identify
people who could reasonably become clients of the coach.

IMPORTANT:

Use public web research.

Do NOT fabricate people.

Do NOT invent profiles, companies, job titles,
goals, problems, achievements, URLs, or circumstances.

Every returned person must have a publicly accessible
source URL that supports the information provided.

=====================================================
COACH INFORMATION
=====================================================

Coaching niche:
${niche}

Ideal client:
${idealClient}

Coach's client goal/problem:
${goal || "Not specified"}

Target location:
${location || "Not specified"}

Requested number of prospects:
${count}

=====================================================
PRIMARY OBJECTIVE
=====================================================

Find REAL PEOPLE who appear to reasonably match the
coach's ideal client.

The intended workflow is:

Discover
→ Start Conversation
→ Reply
→ Follow Up
→ Convert

Search public sources for individuals who may fit the
coach's target audience.

QUALITY IS MORE IMPORTANT THAN QUANTITY.

You may return fewer prospects than requested.

If only 1 strong prospect is found when 2 are requested,
return 1.

If no strong prospects can be verified, return an empty
array.

NEVER create fictional prospects just to reach the
requested number.

=====================================================
SEARCH EFFICIENCY
=====================================================

Use targeted searches.

You have a LIMITED search budget.

Prefer highly specific searches combining:

- coaching niche
- ideal client
- relevant goal/problem
- location when provided

Do not perform broad searches unnecessarily.

Do not search repeatedly for the same information.

Prioritize searches that are most likely to identify
real individual prospects with useful public evidence.

=====================================================
WHAT COUNTS AS A POTENTIAL CLIENT
=====================================================

A potential client is an identifiable individual whose
publicly available information reasonably matches the
coach's stated ideal client.

Examples may include:

- employees
- managers
- executives
- founders
- entrepreneurs
- business owners
- professionals
- creators
- public speakers
- senior professionals
- other individuals whose public information matches
  the coach's criteria

A founder or business owner can be a potential client
if they are NOT themselves selling the same or a
substantially similar service.

=====================================================
STRICTLY REJECT SERVICE PROVIDERS
=====================================================

Do NOT return people who provide the same or substantially
similar services as the coach.

Reject examples such as:

- coaches
- life coaches
- business coaches
- career coaches
- fitness coaches
- personal trainers
- nutrition coaches
- diet coaches
- wellness coaches
- health coaches
- therapists
- consultants
- coaching consultants
- fitness instructors
- gym owners
- fitness studio owners
- wellness business owners
- nutrition business owners
- agencies
- consulting firms
- coaching companies
- people selling substantially similar services

These people are NOT potential clients unless the
coach's specific criteria explicitly make them potential
clients.

=====================================================
REJECT BUSINESSES
=====================================================

The lead must be an INDIVIDUAL PERSON.

Do not return:

- companies
- organizations
- agencies
- gyms
- studios
- brands
- business pages
- company profiles

You may use a company or organization as context for
a person's profile, but the lead itself must be a real
individual.

=====================================================
PUBLIC SOURCE REQUIREMENT
=====================================================

Every lead MUST have a public source URL.

Prefer:

- public LinkedIn profiles
- public professional profiles
- public company/team biography pages
- public creator profiles
- public interviews
- public articles
- public personal websites
- other reputable publicly accessible sources

DO NOT invent URLs.

DO NOT construct a URL based only on a person's name.

Use the exact URL discovered from the public source.

If you cannot provide a valid public source URL,
DO NOT return that person.

The sourceUrl MUST be a plain URL beginning with:

http://

or

https://

Do NOT return Markdown links.

=====================================================
EVIDENCE REQUIREMENTS
=====================================================

Only state information supported by public sources.

Do NOT invent:

- goals
- problems
- interests
- lifestyle
- job title
- company
- achievements
- circumstances
- personal details

Do NOT claim that someone "needs coaching."

Do NOT claim that someone "wants coaching" unless
their public information explicitly supports that.

Do NOT infer:

- income
- wealth
- ability to pay
- financial status
- health conditions
- medical information
- sensitive personal attributes

If evidence is limited, use cautious language such as:

"their public profile suggests..."

"their public information indicates..."

"this may be relevant because..."

=====================================================
CURRENTNESS / RECENCY REQUIREMENT
=====================================================

Prefer recent public evidence that the person's relevant
goal, challenge, or situation is current.

Prioritize evidence from the last 12 months when available.

Do NOT treat an old completed goal, past challenge,
historical transformation, or outdated circumstance as
evidence that the person currently needs the same thing.

If the only evidence is substantially outdated or describes
a problem that appears to have already been resolved,
reject the prospect.

A person may still qualify when older evidence is highly
relevant, but only when there is additional public evidence
suggesting the situation remains relevant.

Quality and current relevance are more important than
filling the requested number.

=====================================================
QUALITY SCREENING
=====================================================

Before returning a candidate, internally check:

1. Is this a real identifiable person?
2. Is there a valid public source?
3. Does the source support the person's identity/profile?
4. Does the person reasonably match the ideal client?
5. Are they actually a potential client rather than a
   service provider?
6. Are we avoiding unsupported assumptions?
7. Is the conversation angle grounded in public evidence?

If any important requirement fails, reject the candidate.

=====================================================
CONVERSATION ANGLE
=====================================================

Create a natural conversation starting point.

The conversation angle must:

- be based on public information
- feel human
- avoid aggressive selling
- avoid claiming the person needs coaching
- avoid private information
- give the coach a genuine reason to start a conversation

Do NOT write a hard sales pitch.

=====================================================
WHY FIT
=====================================================

Explain briefly why the person appears relevant to the
coach's ideal client criteria.

The explanation must be grounded in public evidence.

Do not exaggerate the match.

=====================================================
LIKELY GOAL
=====================================================

Identify a relevant goal, challenge, or situation only
when supported by public information.

If the exact goal is not explicitly stated, describe the
publicly supported situation cautiously.

Do not invent a goal.

=====================================================
REQUESTED COUNT
=====================================================

Return UP TO ${count} strong prospects.

You may return fewer.

Never weaken the screening criteria simply to reach ${count}.

=====================================================
OUTPUT FORMAT
=====================================================

Return ONLY valid JSON.

No markdown.

No explanation outside the JSON.

Use exactly this structure:

{
  "leads": [
    {
      "name": "Full public name",
      "profile": "Short factual professional profile",
      "goal": "Publicly supported relevant goal, challenge, or situation",
      "whyFit": "Why the publicly available evidence suggests this person may match the coach's target audience",
      "conversationAngle": "A natural conversation starting point based on public information",
      "sourceUrl": "https://exact-public-source-url.com/"
    }
  ]
}

If no suitable prospects can be verified:

{
  "leads": []
}
`;

    /*
    =====================================================
    OPENROUTER WEB SEARCH
    =====================================================
    */

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",

          "HTTP-Referer":
            process.env.NEXT_PUBLIC_APP_URL ||
            "https://www.coachdm.pro",

          "X-Title": "CoachDM AI",
        },

        body: JSON.stringify({
          model: "openai/gpt-5.6-luna",

          messages: [
            {
              role: "system",
              content:
                "You are a strict real-world prospect discovery assistant for CoachDM AI. Use public web information, never fabricate people or facts, reject service providers and businesses, and return only prospects supported by public sources.",
            },
            {
              role: "user",
              content: researchPrompt,
            },
          ],

          /*
          -------------------------------------------------
          Web search intentionally limited for cost control.
          -------------------------------------------------
          */

          tools: [
            {
              type: "openrouter:web_search",

              parameters: {
                engine: "exa",

                // Maximum results from an individual search.
                max_results: 5,

                // Maximum cumulative results for this request.
                max_total_results: 10,
              },
            },
          ],

          /*
          -------------------------------------------------
          Maximum number of web-search tool calls.
          -------------------------------------------------
          */

          max_tool_calls: 2,

          response_format: {
            type: "json_object",
          },

          temperature: 0.1,

          max_tokens: 1200,
        }),
      }
    );

    /*
    =====================================================
    OPENROUTER ERROR
    =====================================================
    */

    const raw = await response.text();

    if (!response.ok) {
      console.error(
        "Lead research error:",
        response.status,
        raw
      );

      let errorData: any = null;

      try {
        errorData = JSON.parse(raw);
      } catch {
        // Ignore JSON parsing failure.
      }

      const errorMessage =
        errorData?.error?.message;

      /*
      -----------------------------------------------------
      Insufficient credits
      -----------------------------------------------------
      */

      if (response.status === 402) {
        return NextResponse.json(
          {
            error:
              "Lead research requires OpenRouter credits. Please add credits to your OpenRouter account and try again.",
          },
          { status: 402 }
        );
      }

      /*
      -----------------------------------------------------
      In-flight request budget
      -----------------------------------------------------
      */

      if (
        response.status === 429 ||
        errorData?.error?.metadata?.reason ===
          "in_flight_budget_exhausted"
      ) {
        const retryAfter =
          errorData?.error?.metadata?.headers?.[
            "Retry-After"
          ] ||
          errorData?.error?.metadata?.retry_after;

        return NextResponse.json(
          {
            error: retryAfter
              ? `Lead research is temporarily busy. Please try again in about ${retryAfter} seconds.`
              : "Lead research is temporarily busy. Please try again shortly.",
          },
          { status: 429 }
        );
      }

      return NextResponse.json(
        {
          error:
            errorMessage ||
            "The AI could not research potential clients right now. Please try again.",
        },
        { status: 502 }
      );
    }

    /*
    =====================================================
    PARSE OPENROUTER RESPONSE
    =====================================================
    */

    let data: any;

    try {
      data = JSON.parse(raw);
    } catch {
      console.error(
        "Invalid OpenRouter response:",
        raw
      );

      return NextResponse.json(
        {
          error:
            "The AI returned an invalid research response. Please try again.",
        },
        { status: 502 }
      );
    }

    /*
    =====================================================
    EXTRACT MODEL CONTENT
    =====================================================
    */

    const content =
      data?.choices?.[0]?.message?.content;

    if (
      !content ||
      typeof content !== "string"
    ) {
      console.error(
        "No AI content:",
        JSON.stringify(data, null, 2)
      );

      return NextResponse.json(
        {
          error:
            "The AI did not return any prospect results. Please try again.",
        },
        { status: 502 }
      );
    }

    /*
    =====================================================
    PARSE STRUCTURED JSON
    =====================================================
    */

    let parsed: any;

    try {
      parsed = JSON.parse(content);
    } catch {
      console.error(
        "Lead JSON parsing failed:",
        content
      );

      return NextResponse.json(
        {
          error:
            "The AI returned an invalid lead format. Please try again.",
        },
        { status: 502 }
      );
    }

    /*
    =====================================================
    FINAL VALIDATION
    =====================================================
    */

    const leads = Array.isArray(parsed?.leads)
      ? parsed.leads
          .map((lead: any) => ({
            name: String(
              lead?.name || ""
            ).trim(),

            profile: String(
              lead?.profile || ""
            ).trim(),

            goal: String(
              lead?.goal || ""
            ).trim(),

            whyFit: String(
              lead?.whyFit || ""
            ).trim(),

            conversationAngle:
              String(
                lead?.conversationAngle || ""
              ).trim(),

            sourceUrl: String(
              lead?.sourceUrl || ""
            ).trim(),
          }))

          /*
          -------------------------------------------------
          Require every important field.
          -------------------------------------------------
          */

          .filter(
            (lead: any) =>
              lead.name &&
              lead.profile &&
              lead.goal &&
              lead.whyFit &&
              lead.conversationAngle &&
              /^https?:\/\//i.test(
                lead.sourceUrl
              )
          )

          /*
          -------------------------------------------------
          Never return more than requested.
          -------------------------------------------------
          */

          .slice(0, count)
      : [];

    /*
    =====================================================
    NO QUALIFIED PROSPECTS
    =====================================================
    */

    if (leads.length === 0) {
      return NextResponse.json(
        {
          error:
            "No suitable potential clients were found from the available public information. Try adjusting the niche, ideal client, goal, or location.",
        },
        { status: 404 }
      );
    }

    /*
    =====================================================
    SUCCESS
    =====================================================
    */

    return NextResponse.json({
      leads,
      researched: true,
      source: "web_research",
    });
  } catch (error) {
    console.error(
      "Generate leads API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to research potential clients right now. Please try again.",
      },
      { status: 500 }
    );
  }
}