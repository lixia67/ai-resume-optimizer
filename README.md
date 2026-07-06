# AI Resume Optimizer

AI Resume Optimizer is a small Next.js MVP that turns raw experience into role-specific resume content and interview talking points using the DeepSeek Chat Completions API.

## Features

- Responsive landing page
- Target role and experience input
- Example content autofill
- Client-side input validation
- Real DeepSeek resume optimization
- Structured results for:
  - Optimized Resume
  - Why This Works
  - Interview Script
- Copy individual result sections
- Copy the complete result as Markdown
- Loading, API error, and AI response format handling

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Next.js Route Handler
- DeepSeek Chat Completions API

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` in the project root:

```bash
DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

Do not commit `.env.local` or place a real API key in source code. The repository's `.gitignore` excludes local environment files.

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000).

## Validation Commands

```bash
npm run lint
npm run build
```

## Application Flow

1. Open the landing page and select **Start Optimizing**.
2. Enter a target role and raw resume experience, or select **Use Example**.
3. Select **Optimize Resume**.
4. Review the three structured result sections.
5. Copy one section or copy the complete result as Markdown.

## API

`POST /api/optimize`

Request body:

```json
{
  "job": "Frontend Developer Intern",
  "experience": "Built a campus second-hand trading mini app."
}
```

The Route Handler reads `DEEPSEEK_API_KEY` on the server and returns a structured optimization result. The browser never receives or reads the API key.

## Deploy to Vercel

Vercel can deploy this Next.js project without additional runtime configuration.

1. Push the project to a GitHub, GitLab, or Bitbucket repository. Confirm that `.env.local` is not included in the commit.
2. In Vercel, select **Add New Project** and import the repository.
3. Keep the detected framework preset as **Next.js**. Use the repository root as the Root Directory and keep the default install and build commands.
4. Before deploying, open **Project Settings > Environment Variables** and add:

```text
Name: DEEPSEEK_API_KEY
Value: your_deepseek_api_key
Environments: Production and Preview
```

Do not rename this variable with a `NEXT_PUBLIC_` prefix. It must remain server-only.

5. Deploy the project. If the environment variable is added or changed after a deployment, trigger a new deployment so the new value is available to the Vercel Function.

See the official [Next.js on Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs) and [Environment Variables](https://vercel.com/docs/environment-variables) documentation for dashboard and CLI alternatives.

### Post-Deployment Test

1. Open the production deployment URL and confirm the landing page loads.
2. Select **Start Optimizing** and confirm `/resume` loads.
3. Select **Use Example** and then **Optimize Resume**.
4. Confirm the request completes and all three structured result cards appear.
5. Test an individual **Copy** button and **Copy All as Markdown** in a browser with clipboard permission.
6. If optimization returns `Server missing DEEPSEEK_API_KEY.`, confirm the variable is configured for the current Vercel environment and redeploy.

## MVP Scope

This version intentionally does not include authentication, payments, a database, file uploads, or history management.
