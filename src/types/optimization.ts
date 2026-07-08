export type AiEvaluation = {
  overall: number;
  clarity: number;
  impact: number;
  relevance: number;
  keywordCoverage: number;
  analysis: string;
};

export type ResumeDiffChangeType = "clarity" | "impact" | "keyword" | "structure";

export type ResumeDiffChange = {
  type: ResumeDiffChangeType;
  before: string;
  after: string;
  reason: string;
};

export type ResumeDiff = {
  before: string;
  after: string;
  changes: ResumeDiffChange[];
};

export type JdMatchAnalysis = {
  matchedStrengths: string[];
  missingKeywords: string[];
  improvementFocus: string[];
  roleFitSummary: string;
};

export type AtsReadiness = {
  score: number;
  keywordSignals: string[];
  readabilityNotes: string[];
  riskAreas: string[];
  summary: string;
};

export type OptimizeResult = {
  optimizedResume: string;
  reason: string;
  interviewScript: string;
  aiEvaluation: AiEvaluation;
  diff: ResumeDiff;
  jdMatchAnalysis: JdMatchAnalysis;
  atsReadiness: AtsReadiness;
};

export type OptimizeSuccessResponse = {
  success: true;
  result: OptimizeResult;
};

export type OptimizeErrorResponse = {
  success: false;
  error: string;
};

export type OptimizeResponse = OptimizeSuccessResponse | OptimizeErrorResponse;
