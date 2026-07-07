export type AiEvaluation = {
  overall: number;
  clarity: number;
  impact: number;
  relevance: number;
  keywordCoverage: number;
  analysis: string;
};

export type OptimizeResult = {
  optimizedResume: string;
  reason: string;
  interviewScript: string;
  aiEvaluation: AiEvaluation;
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
