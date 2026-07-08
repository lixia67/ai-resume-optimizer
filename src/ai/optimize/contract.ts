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
  },
  "diff": {
    "before": "string",
    "after": "string",
    "changes": [
      {
        "type": "clarity",
        "before": "string",
        "after": "string",
        "reason": "string"
      }
    ]
  },
  "jdMatchAnalysis": {
    "matchedStrengths": ["string"],
    "missingKeywords": ["string"],
    "improvementFocus": ["string"],
    "roleFitSummary": "string"
  },
  "atsReadiness": {
    "score": 78,
    "keywordSignals": ["string"],
    "readabilityNotes": ["string"],
    "riskAreas": ["string"],
    "summary": "string"
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
  "diff.before: the user's original experience text.",
  "diff.after: exactly the same string as optimizedResume.",
  "diff.changes: one to four specific changes made during optimization.",
  "diff.changes[].type: one of clarity, impact, keyword, or structure.",
  "diff.changes[].before: the original expression fragment.",
  "diff.changes[].after: the optimized expression fragment.",
  "diff.changes[].reason: why this change improves the resume.",
  "jdMatchAnalysis.matchedStrengths: one to three strengths from the original experience that match the target role.",
  "jdMatchAnalysis.missingKeywords: zero to five role-relevant keyword opportunities not clearly shown in the resume.",
  "jdMatchAnalysis.improvementFocus: one to five concrete next-step improvements.",
  "jdMatchAnalysis.roleFitSummary: concise role-fit summary.",
  "atsReadiness.score: AI-generated resume readiness score from 0 to 100, not a real ATS result.",
  "atsReadiness.keywordSignals: one to five supported keyword signals from the provided job input or resume content.",
  "atsReadiness.readabilityNotes: one to five notes about clarity, parsing friendliness, or concise resume wording.",
  "atsReadiness.riskAreas: zero to five readiness risks or weak signals.",
  "atsReadiness.summary: concise AI-generated readiness summary.",
];
