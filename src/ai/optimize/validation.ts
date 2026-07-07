import type { OptimizeResult, ResumeDiffChangeType } from "@/types/optimization";

export const AI_RESPONSE_FORMAT_ERROR = "AI response format error.";

const allowedDiffChangeTypes = new Set(["clarity", "impact", "keyword", "structure"]);

function isResumeDiffChangeType(value: unknown): value is ResumeDiffChangeType {
  return typeof value === "string" && allowedDiffChangeTypes.has(value);
}

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
  if (!isRecord(value) || !isRecord(value.aiEvaluation) || !isRecord(value.diff)) {
    throw new Error(AI_RESPONSE_FORMAT_ERROR);
  }

  const optimizedResume = readRequiredString(value.optimizedResume);
  const reason = readRequiredString(value.reason);
  const interviewScript = readRequiredString(value.interviewScript);
  const evaluation = value.aiEvaluation;
  const analysis = readRequiredString(evaluation.analysis);
  const diff = value.diff;
  const diffBefore = readRequiredString(diff.before);
  const diffAfter = readRequiredString(diff.after);

  if (
    !optimizedResume ||
    !reason ||
    !interviewScript ||
    !isValidScore(evaluation.overall) ||
    !isValidScore(evaluation.clarity) ||
    !isValidScore(evaluation.impact) ||
    !isValidScore(evaluation.relevance) ||
    !isValidScore(evaluation.keywordCoverage) ||
    !analysis ||
    !diffBefore ||
    !diffAfter ||
    diffAfter !== optimizedResume ||
    !Array.isArray(diff.changes) ||
    diff.changes.length < 1 ||
    diff.changes.length > 4
  ) {
    throw new Error(AI_RESPONSE_FORMAT_ERROR);
  }

  const changes = diff.changes.map((change) => {
    if (!isRecord(change) || !isResumeDiffChangeType(change.type)) {
      throw new Error(AI_RESPONSE_FORMAT_ERROR);
    }

    const before = readRequiredString(change.before);
    const after = readRequiredString(change.after);
    const changeReason = readRequiredString(change.reason);

    if (!before || !after || !changeReason) {
      throw new Error(AI_RESPONSE_FORMAT_ERROR);
    }

    return {
      type: change.type,
      before,
      after,
      reason: changeReason,
    };
  });

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
    diff: {
      before: diffBefore,
      after: diffAfter,
      changes,
    },
  };
}
