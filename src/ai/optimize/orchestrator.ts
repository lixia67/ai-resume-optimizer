import type { OptimizeResult } from "@/types/optimization";

import { callDeepSeekJson } from "../providers/deepseek";
import { buildOptimizationUserPrompt, optimizationSystemPrompt } from "./prompt";
import { AI_RESPONSE_FORMAT_ERROR, validateOptimizeResult } from "./validation";

export async function optimizeResumeWithAi(
  job: string,
  experience: string
): Promise<OptimizeResult> {
  const content = await callDeepSeekJson(
    optimizationSystemPrompt,
    buildOptimizationUserPrompt(job, experience)
  );

  try {
    return validateOptimizeResult(JSON.parse(content) as unknown);
  } catch {
    throw new Error(AI_RESPONSE_FORMAT_ERROR);
  }
}
