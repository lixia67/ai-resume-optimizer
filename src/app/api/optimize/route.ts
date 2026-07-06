import { NextResponse } from "next/server";

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

type OptimizeResult = {
  optimizedResume: string;
  reason: string;
  interviewScript: string;
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
            content:
              '你是一名资深互联网 HR 和简历优化专家，请帮助用户把经历优化成适合求职简历的专业表达。要求语言简洁、突出成果、适合应届生和实习生。只返回合法 JSON，不要返回 Markdown、代码块或任何额外说明。JSON 格式必须严格为：{"optimizedResume":"优化后的简历描述","reason":"优化理由","interviewScript":"面试时可以如何讲述这段经历"}。',
          },
          {
            role: "user",
            content: `目标岗位：${body.job}\n原始经历：${body.experience}`,
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

    let result: OptimizeResult;

    try {
      const parsed = JSON.parse(content) as Partial<OptimizeResult>;

      if (
        typeof parsed.optimizedResume !== "string" ||
        !parsed.optimizedResume.trim() ||
        typeof parsed.reason !== "string" ||
        !parsed.reason.trim() ||
        typeof parsed.interviewScript !== "string" ||
        !parsed.interviewScript.trim()
      ) {
        throw new Error("DeepSeek response fields are invalid.");
      }

      result = {
        optimizedResume: parsed.optimizedResume.trim(),
        reason: parsed.reason.trim(),
        interviewScript: parsed.interviewScript.trim(),
      };
    } catch {
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
