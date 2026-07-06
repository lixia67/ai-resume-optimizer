import { NextResponse } from "next/server";

import type { OptimizeResult } from "@/types/optimization";

type OptimizeRequest = {
  job?: unknown;
  experience?: unknown;
};

type DeepSeekResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

const systemPrompt = `You are an AI Resume Reviewer and Optimization Assistant.

Follow this process internally:
1. Review the user's original experience against the target job.
2. Generate an AI evaluation with structured scores.
3. Rewrite the resume content.
4. Explain why the rewrite works.
5. Generate an interview script.

Return only a valid JSON object. Do not return Markdown, code fences, or additional text.

The JSON must use this exact structure:
{
  "optimizedResume": "...",
  "reason": "...",
  "interviewScript": "...",
  "aiEvaluation": {
    "overall": 82,
    "clarity": 80,
    "impact": 85,
    "relevance": 78,
    "keywordCoverage": 84,
    "analysis": "..."
  }
}

All five scores must be finite numbers between 0 and 100. The analysis must be a concise, non-empty explanation of the evaluation. Keep the resume rewrite professional, concise, outcome-oriented, and appropriate for students or interns. Do not invent skills, technologies, responsibilities, metrics, or outcomes that are not supported by the original experience. If impact is not quantified, improve the wording without fabricating numbers.`;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isValidScore(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 100;
}

function parseOptimizeResult(value: unknown): OptimizeResult | null {
  if (!isRecord(value) || !isRecord(value.aiEvaluation)) {
    return null;
  }

  const evaluation = value.aiEvaluation;

  if (
    typeof value.optimizedResume !== "string" ||
    !value.optimizedResume.trim() ||
    typeof value.reason !== "string" ||
    !value.reason.trim() ||
    typeof value.interviewScript !== "string" ||
    !value.interviewScript.trim() ||
    !isValidScore(evaluation.overall) ||
    !isValidScore(evaluation.clarity) ||
    !isValidScore(evaluation.impact) ||
    !isValidScore(evaluation.relevance) ||
    !isValidScore(evaluation.keywordCoverage) ||
    typeof evaluation.analysis !== "string" ||
    !evaluation.analysis.trim()
  ) {
    return null;
  }

  return {
    optimizedResume: value.optimizedResume.trim(),
    reason: value.reason.trim(),
    interviewScript: value.interviewScript.trim(),
    aiEvaluation: {
      overall: evaluation.overall,
      clarity: evaluation.clarity,
      impact: evaluation.impact,
      relevance: evaluation.relevance,
      keywordCoverage: evaluation.keywordCoverage,
      analysis: evaluation.analysis.trim(),
    },
  };
}

export async function POST(request: Request) {
  let body: OptimizeRequest;

  try {
    body = (await request.json()) as OptimizeRequest;
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid JSON request body.",
      },
      { status: 400 }
    );
  }

  if (typeof body.job !== "string" || typeof body.experience !== "string") {
    return NextResponse.json(
      {
        success: false,
        error: "Job and experience must be strings.",
      },
      { status: 400 }
    );
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        success: false,
        error: "Server missing DEEPSEEK_API_KEY.",
      },
      { status: 500 }
    );
  }

  try {
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-v4-flash",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: `Target job: ${body.job}\nOriginal experience: ${body.experience}`,
          },
        ],
        response_format: {
          type: "json_object",
        },
        stream: false,
      }),
    });

    if (response.status === 402) {
      return NextResponse.json(
        {
          success: false,
          error: "AI service balance is insufficient. Please recharge the API account.",
        },
        { status: 502 }
      );
    }

    if (response.status === 401 || response.status === 403) {
      return NextResponse.json(
        {
          success: false,
          error: "AI service authentication failed.",
        },
        { status: 502 }
      );
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: "AI optimization failed.",
        },
        { status: 500 }
      );
    }

    const data = (await response.json()) as DeepSeekResponse;
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        {
          success: false,
          error: "AI response format error.",
        },
        { status: 500 }
      );
    }

    let result: OptimizeResult | null;

    try {
      result = parseOptimizeResult(JSON.parse(content) as unknown);
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "AI response format error.",
        },
        { status: 500 }
      );
    }

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          error: "AI response format error.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      result,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "AI optimization failed.",
      },
      { status: 500 }
    );
  }
}
