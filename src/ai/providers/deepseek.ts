type DeepSeekResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

export class DeepSeekProviderError extends Error {
  constructor(
    message: string,
    public readonly statusCode = 500
  ) {
    super(message);
    this.name = "DeepSeekProviderError";
  }
}

const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";
const DEEPSEEK_MODEL = "deepseek-v4-flash";

export async function callDeepSeekJson(systemPrompt: string, userPrompt: string) {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    throw new DeepSeekProviderError("Server missing DEEPSEEK_API_KEY.", 500);
  }

  const response = await fetch(DEEPSEEK_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: DEEPSEEK_MODEL,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      response_format: {
        type: "json_object",
      },
      stream: false,
    }),
  });

  if (response.status === 402) {
    throw new DeepSeekProviderError(
      "AI service balance is insufficient. Please recharge the API account.",
      502
    );
  }

  if (response.status === 401 || response.status === 403) {
    throw new DeepSeekProviderError("AI service authentication failed.", 502);
  }

  if (!response.ok) {
    throw new DeepSeekProviderError("AI optimization failed.", 500);
  }

  const data = (await response.json()) as DeepSeekResponse;
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new DeepSeekProviderError("AI response format error.", 500);
  }

  return content;
}
