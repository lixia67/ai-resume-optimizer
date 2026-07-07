import { NextResponse } from "next/server";

import { optimizeResumeWithAi } from "@/ai/optimize/orchestrator";
import { AI_RESPONSE_FORMAT_ERROR } from "@/ai/optimize/validation";
import { DeepSeekProviderError } from "@/ai/providers/deepseek";

type OptimizeRequest = {
  job?: unknown;
  experience?: unknown;
};

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

  try {
    const result = await optimizeResumeWithAi(body.job, body.experience);

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    if (error instanceof DeepSeekProviderError) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: error.statusCode }
      );
    }

    if (error instanceof Error && error.message === AI_RESPONSE_FORMAT_ERROR) {
      return NextResponse.json(
        {
          success: false,
          error: AI_RESPONSE_FORMAT_ERROR,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "AI optimization failed.",
      },
      { status: 500 }
    );
  }
}
