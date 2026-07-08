# AI Resume Optimizer

AI Resume Optimizer is an AI application showcase project that turns raw experience into structured, explainable resume optimization output.

## Project Overview

The project demonstrates how to build a practical AI workflow with a Next.js frontend, a server-side route handler, a dedicated AI orchestration layer, structured JSON output, runtime validation, and type-safe UI rendering.

It is intentionally scoped as a portfolio project, not a commercial SaaS product. It does not include authentication, payments, a database, or user history.

## Live Demo

[https://ai-resume-optimizer-lovat.vercel.app](https://ai-resume-optimizer-lovat.vercel.app)

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Next.js Route Handler
- DeepSeek Chat Completions API
- Vercel

## Core Features

- Responsive landing page
- Resume experience input with example autofill
- DeepSeek-powered resume optimization
- AI Evaluation with structured quality scores
- JD Match Analysis for role-fit strengths and keyword opportunities
- ATS Readiness as an AI-generated resume readiness assessment
- Resume Diff with before-and-after explanations
- Interview Script generation
- Copy individual sections
- Copy all results as Markdown

## AI Workflow

The AI workflow is designed as a single-call structured pipeline:

```text
Job Understanding
-> JD Match Analysis
-> ATS Readiness
-> Resume Optimization
-> Resume Diff
-> Interview Preparation
-> Structured JSON Output
```

The output is validated before it reaches the UI, so the page renders typed data instead of trusting raw model text.

## Architecture

```text
Browser
-> Next.js Route Handler
-> AI Orchestrator
-> Prompt Pipeline
-> DeepSeek Provider
-> Runtime Validation
-> Type-safe UI Rendering
```

The route handler owns HTTP concerns. The AI orchestration layer owns prompt construction, provider calls, response parsing, and validation. The frontend only receives structured, type-safe result data.

## Engineering Highlights

- Server-only API key handling
- AI Orchestration Layer
- Prompt Engineering with a clear workflow
- Structured JSON Contract
- Runtime Validation for model output
- Type-safe response rendering
- Provider Boundary for DeepSeek-specific logic
- Explainable AI output through JD Match Analysis and Resume Diff
- Vercel production deployment

## Local Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Run project checks:

```bash
npm run format:check
npm run lint
npm run build
```

## Environment Variables

Create `.env.local` in the project root:

```bash
DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

Do not commit `.env.local` or place a real API key in source code. Do not expose this key with a `NEXT_PUBLIC_` prefix.

## Deployment

The project is deployed on Vercel.

To deploy your own copy:

1. Push the repository to GitHub.
2. Import the project into Vercel.
3. Keep the framework preset as Next.js.
4. Add `DEEPSEEK_API_KEY` in Vercel Project Settings.
5. Deploy and test `/resume` with the example input.

If the API returns `Server missing DEEPSEEK_API_KEY.`, confirm the variable is configured for the current Vercel environment and redeploy.

## Future Improvements

- Prompt Presets for different optimization styles
- Download Markdown export
- Prompt Inspector for showcasing prompt design
- PDF Upload as a future optional input path
