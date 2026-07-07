import type { OptimizeResult } from "@/types/optimization";

export const AI_RESPONSE_FORMAT_ERROR = "AI response format error.";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isValidScore(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 100;
}

function readRequiredString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

export function validateOptimizeResult(value: unknown): OptimizeResult {
  if (!isRecord(value) || !isRecord(value.aiEvaluation)) {
    throw new Error(AI_RESPONSE_FORMAT_ERROR);
  }

  const optimizedResume = readRequiredString(value.optimizedResume);
  const reason = readRequiredString(value.reason);
  const interviewScript = readRequiredString(value.interviewScript);
  const evaluation = value.aiEvaluation;
  const analysis = readRequiredString(evaluation.analysis);

  if (
    !optimizedResume ||
    !reason ||
    !interviewScript ||
    !isValidScore(evaluation.overall) ||
    !isValidScore(evaluation.clarity) ||
    !isValidScore(evaluation.impact) ||
    !isValidScore(evaluation.relevance) ||
    !isValidScore(evaluation.keywordCoverage) ||
    !analysis
  ) {
    throw new Error(AI_RESPONSE_FORMAT_ERROR);
  }

  return {
    optimizedResume,
    reason,
    interviewScript,
    aiEvaluation: {
      overall: evaluation.overall,
      clarity: evaluation.clarity,
      impact: evaluation.impact,
      relevance: evaluation.relevance,
      keywordCoverage: evaluation.keywordCoverage,
      analysis,
    },
  };
}
