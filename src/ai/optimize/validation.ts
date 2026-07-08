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

function isStringArrayInRange(
  value: unknown,
  minLength: number,
  maxLength: number
): value is string[] {
  return (
    Array.isArray(value) &&
    value.length >= minLength &&
    value.length <= maxLength &&
    value.every((item) => typeof item === "string" && item.trim().length > 0)
  );
}

export function validateOptimizeResult(value: unknown): OptimizeResult {
  if (
    !isRecord(value) ||
    !isRecord(value.aiEvaluation) ||
    !isRecord(value.diff) ||
    !isRecord(value.jdMatchAnalysis) ||
    !isRecord(value.atsReadiness)
  ) {
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
  const jdMatchAnalysis = value.jdMatchAnalysis;
  const roleFitSummary = readRequiredString(jdMatchAnalysis.roleFitSummary);
  const atsReadiness = value.atsReadiness;
  const atsSummary = readRequiredString(atsReadiness.summary);

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
    diff.changes.length > 4 ||
    !isStringArrayInRange(jdMatchAnalysis.matchedStrengths, 1, 3) ||
    !isStringArrayInRange(jdMatchAnalysis.missingKeywords, 0, 5) ||
    !isStringArrayInRange(jdMatchAnalysis.improvementFocus, 1, 5) ||
    !roleFitSummary ||
    !isValidScore(atsReadiness.score) ||
    !isStringArrayInRange(atsReadiness.keywordSignals, 1, 5) ||
    !isStringArrayInRange(atsReadiness.readabilityNotes, 1, 5) ||
    !isStringArrayInRange(atsReadiness.riskAreas, 0, 5) ||
    !atsSummary
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
    jdMatchAnalysis: {
      matchedStrengths: jdMatchAnalysis.matchedStrengths,
      missingKeywords: jdMatchAnalysis.missingKeywords,
      improvementFocus: jdMatchAnalysis.improvementFocus,
      roleFitSummary,
    },
    atsReadiness: {
      score: atsReadiness.score,
      keywordSignals: atsReadiness.keywordSignals,
      readabilityNotes: atsReadiness.readabilityNotes,
      riskAreas: atsReadiness.riskAreas,
      summary: atsSummary,
    },
  };
}
