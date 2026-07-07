export const OPTIMIZATION_CONTRACT_NAME = "ai-resume-optimization";

export const OPTIMIZATION_CONTRACT_VERSION = "1.0.0";

export const OPTIMIZATION_EXPECTED_JSON_SHAPE = `{
  "optimizedResume": "string",
  "reason": "string",
  "interviewScript": "string",
  "aiEvaluation": {
    "overall": 82,
    "clarity": 80,
    "impact": 85,
    "relevance": 78,
    "keywordCoverage": 84,
    "analysis": "string"
  }
}`;

export const OPTIMIZATION_SCORING_RULES =
  "All five scores must be finite numbers between 0 and 100. Do not clamp or fabricate scores.";

export const OPTIMIZATION_FIELD_GUIDE = [
  "optimizedResume: the rewritten resume-ready version of the original experience.",
  "reason: why the rewrite is stronger for the target job.",
  "interviewScript: how the candidate can explain the experience in an interview.",
  "aiEvaluation.overall: overall quality evaluation.",
  "aiEvaluation.clarity: clarity of expression.",
  "aiEvaluation.impact: strength of outcome and contribution.",
  "aiEvaluation.relevance: relevance to the target job.",
  "aiEvaluation.keywordCoverage: coverage of role-relevant keywords.",
  "aiEvaluation.analysis: concise explanation of the evaluation.",
];
