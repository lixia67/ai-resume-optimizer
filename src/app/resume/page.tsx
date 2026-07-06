"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";

import type { AiEvaluation, OptimizeResult } from "@/types/optimization";

type OptimizeResponse = {
  success: boolean;
  result?: OptimizeResult;
  error?: string;
};

type ResultField = "optimizedResume" | "reason" | "interviewScript";
type CopyTarget = ResultField | "all";
type EvaluationMetric = Exclude<keyof AiEvaluation, "overall" | "analysis">;

type CopyFeedback = {
  target: CopyTarget;
  status: "success" | "error";
} | null;

const resultCards: Array<{
  field: ResultField;
  title: string;
  className: string;
}> = [
  {
    field: "optimizedResume",
    title: "Optimized Resume",
    className: "border-indigo-200 bg-indigo-50",
  },
  {
    field: "reason",
    title: "Why This Works",
    className: "border-emerald-200 bg-emerald-50",
  },
  {
    field: "interviewScript",
    title: "Interview Script",
    className: "border-amber-200 bg-amber-50",
  },
];

const evaluationMetrics: Array<{
  field: EvaluationMetric;
  label: string;
}> = [
  { field: "clarity", label: "Clarity" },
  { field: "impact", label: "Impact" },
  { field: "relevance", label: "Relevance" },
  { field: "keywordCoverage", label: "Keyword Coverage" },
];

const exampleJob = "Frontend Developer Intern";
const exampleExperience =
  "Built a campus second-hand trading mini app. Responsible for product listing, search page, and user interaction. Used JavaScript, WXML/WXSS, and local mock data.";

function formatResultAsMarkdown(result: OptimizeResult) {
  const evaluation = result.aiEvaluation;

  return [
    "# AI Resume Optimization Result",
    "",
    ...(evaluation
      ? [
          "## AI Evaluation",
          `- Overall: ${evaluation.overall}/100`,
          `- Clarity: ${evaluation.clarity}/100`,
          `- Impact: ${evaluation.impact}/100`,
          `- Relevance: ${evaluation.relevance}/100`,
          `- Keyword Coverage: ${evaluation.keywordCoverage}/100`,
          "",
          `Analysis: ${evaluation.analysis}`,
          "",
        ]
      : []),
    "## Optimized Resume",
    result.optimizedResume,
    "",
    "## Why This Works",
    result.reason,
    "",
    "## Interview Script",
    result.interviewScript,
  ].join("\n");
}

export default function ResumePage() {
  const [job, setJob] = useState("");
  const [experience, setExperience] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<OptimizeResult | null>(null);
  const [error, setError] = useState("");
  const [copyFeedback, setCopyFeedback] = useState<CopyFeedback>(null);
  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current);
      }
    };
  }, []);

  async function handleCopy(target: CopyTarget, content: string) {
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
    }

    try {
      await navigator.clipboard.writeText(content);
      setCopyFeedback({ target, status: "success" });
    } catch {
      setCopyFeedback({ target, status: "error" });
    }

    feedbackTimeoutRef.current = setTimeout(() => {
      setCopyFeedback(null);
      feedbackTimeoutRef.current = null;
    }, 2500);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    const trimmedJob = job.trim();
    const trimmedExperience = experience.trim();

    if (!trimmedJob) {
      setResult(null);
      setError("Please enter a target role.");
      return;
    }

    if (!trimmedExperience) {
      setResult(null);
      setError("Please enter your resume or experience.");
      return;
    }

    setIsLoading(true);
    setResult(null);
    setError("");

    try {
      const response = await fetch("/api/optimize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ job: trimmedJob, experience: trimmedExperience }),
      });
      const data = (await response.json()) as OptimizeResponse;

      if (!response.ok) {
        setError(data.error ?? "Unable to optimize your resume.");
        return;
      }

      if (!data.success || !data.result) {
        setError(data.error ?? "Unable to optimize your resume.");
        return;
      }

      setResult(data.result);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to optimize your resume. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleUseExample() {
    setJob(exampleJob);
    setExperience(exampleExperience);
    setResult(null);
    setError("");
    setCopyFeedback(null);

    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
      feedbackTimeoutRef.current = null;
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        <header className="border-b border-slate-200 pb-8 sm:pb-10">
          <Link
            href="/"
            className="text-sm font-semibold text-indigo-700 transition-colors hover:text-indigo-900"
          >
            Back to home
          </Link>
          <div className="mt-8 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-700">
              Resume workspace
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-normal text-slate-950 sm:text-5xl">
              AI Resume Optimizer
            </h1>
            <p className="mt-4 text-lg leading-8 text-slate-600 sm:text-xl">
              Turn raw experience into polished resume bullets and interview talking points.
            </p>
          </div>
        </header>

        <div className="mt-8 grid items-start gap-8 lg:mt-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-10">
          <form
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-8 lg:sticky lg:top-8"
            onSubmit={handleSubmit}
            aria-busy={isLoading}
          >
            <div className="border-b border-slate-200 pb-5">
              <p className="text-sm font-semibold uppercase tracking-wide text-indigo-700">Input</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">Experience details</h2>
            </div>

            <div className="mt-6 space-y-7">
              <div>
                <label htmlFor="target-role" className="text-sm font-semibold text-slate-900">
                  Target role or job title
                </label>
                <input
                  id="target-role"
                  name="targetRole"
                  type="text"
                  value={job}
                  onChange={(event) => setJob(event.target.value)}
                  placeholder="e.g. Frontend Engineer"
                  className="mt-2 h-13 w-full rounded-md border border-slate-300 bg-white px-4 text-base text-slate-950 outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label htmlFor="resume-content" className="text-sm font-semibold text-slate-900">
                  Resume bullet or raw experience
                </label>
                <textarea
                  id="resume-content"
                  name="resumeContent"
                  rows={12}
                  value={experience}
                  onChange={(event) => setExperience(event.target.value)}
                  placeholder="Paste your resume or describe your experience here."
                  className="mt-2 w-full resize-y rounded-md border border-slate-300 bg-white px-4 py-3.5 text-base leading-7 text-slate-950 outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex h-12 w-full items-center justify-center rounded-md bg-slate-950 px-5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {isLoading ? "Optimizing..." : "Optimize Resume"}
              </button>
              <button
                type="button"
                disabled={isLoading}
                onClick={handleUseExample}
                className="inline-flex h-12 w-full items-center justify-center rounded-md border border-slate-300 bg-white px-5 text-base font-semibold text-slate-900 shadow-sm transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
              >
                Use Example
              </button>
            </div>
          </form>

          <section aria-live="polite" className="min-w-0">
            <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-indigo-700">
                  Optimization result
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950">Tailored output</h2>
              </div>
              {result ? (
                <button
                  type="button"
                  onClick={() => handleCopy("all", formatResultAsMarkdown(result))}
                  className="inline-flex h-10 w-full min-w-52 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 shadow-sm transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-200 sm:w-auto"
                >
                  {copyFeedback?.target === "all" && copyFeedback.status === "success"
                    ? "Copied all!"
                    : "Copy All as Markdown"}
                </button>
              ) : null}
            </div>
            {copyFeedback?.target === "all" && copyFeedback.status === "error" ? (
              <p
                role="alert"
                className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
              >
                Copy failed. Please copy manually.
              </p>
            ) : null}
            {error ? (
              <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-5 sm:p-6">
                <p role="alert" className="leading-7 text-red-700">
                  {error}
                </p>
              </div>
            ) : result ? (
              <div className="mt-6 space-y-5">
                {result.aiEvaluation ? (
                  <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                    <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-700">
                          AI Evaluation
                        </p>
                        <h3 className="mt-2 text-xl font-semibold text-slate-950">Overall Score</h3>
                      </div>
                      <p className="text-slate-600">
                        <span className="text-3xl font-semibold text-slate-950">
                          {result.aiEvaluation.overall}
                        </span>{" "}
                        / 100
                      </p>
                    </div>

                    <dl className="mt-5 grid gap-3 sm:grid-cols-2">
                      {evaluationMetrics.map((metric) => (
                        <div
                          key={metric.field}
                          className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-4 py-3"
                        >
                          <dt className="text-sm font-medium text-slate-600">{metric.label}</dt>
                          <dd className="font-semibold text-slate-950">
                            {result.aiEvaluation[metric.field]} / 100
                          </dd>
                        </div>
                      ))}
                    </dl>

                    <div className="mt-5 border-t border-slate-200 pt-5">
                      <p className="text-sm font-semibold text-slate-950">Analysis</p>
                      <p className="mt-2 whitespace-pre-wrap leading-7 text-slate-700">
                        {result.aiEvaluation.analysis}
                      </p>
                    </div>

                    <p className="mt-5 text-xs text-slate-500">Generated by DeepSeek V4 Flash</p>
                  </article>
                ) : null}

                {resultCards.map((card) => {
                  const isCopied =
                    copyFeedback?.target === card.field && copyFeedback.status === "success";
                  const hasCopyError =
                    copyFeedback?.target === card.field && copyFeedback.status === "error";

                  return (
                    <article
                      key={card.field}
                      className={`rounded-lg border p-5 sm:p-6 ${card.className}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-lg font-semibold text-slate-950">{card.title}</h3>
                        <button
                          type="button"
                          onClick={() => handleCopy(card.field, result[card.field])}
                          aria-label={`Copy ${card.title}`}
                          className="inline-flex h-9 min-w-20 shrink-0 items-center justify-center rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 shadow-sm transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                        >
                          {isCopied ? "Copied!" : "Copy"}
                        </button>
                      </div>
                      <p className="mt-5 break-words whitespace-pre-wrap border-t border-slate-900/10 pt-5 leading-7 text-slate-700">
                        {result[card.field]}
                      </p>
                      {hasCopyError ? (
                        <p role="alert" className="mt-3 text-sm font-medium text-red-700">
                          Copy failed. Please copy manually.
                        </p>
                      ) : null}
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="mt-6 flex min-h-48 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center shadow-sm sm:min-h-56">
                <p className="max-w-sm leading-7 text-slate-600">
                  {isLoading
                    ? "Sending your resume to the AI optimization service..."
                    : "Your optimized resume result will appear here."}
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
