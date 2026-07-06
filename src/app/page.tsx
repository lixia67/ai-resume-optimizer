import Link from "next/link";

const features = [
  {
    title: "AI Resume Optimization",
    description:
      "Turn raw experience into concise, professional resume language tailored to a target role.",
  },
  {
    title: "Role-Specific Tailoring",
    description:
      "Align your experience with the position you want while keeping the content clear and credible.",
  },
  {
    title: "Interview Talking Points",
    description:
      "Prepare a structured explanation of your experience for interviews and application follow-ups.",
  },
];

const steps = [
  {
    step: "Step 1",
    title: "Choose a Target Role",
    description: "Enter the internship or job title you are applying for.",
  },
  {
    step: "Step 2",
    title: "Add Your Experience",
    description: "Paste a raw resume bullet or describe the work you completed.",
  },
  {
    step: "Step 3",
    title: "Generate Tailored Results",
    description: "Review optimized content, reasoning, and interview talking points.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="px-6 py-20 sm:py-24 lg:px-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
          <p className="mb-5 rounded-full border border-indigo-200 bg-white px-4 py-1.5 text-sm font-medium text-indigo-700 shadow-sm">
            Built for students, graduates, and job seekers
          </p>
          <h1 className="max-w-4xl text-5xl font-semibold tracking-normal text-slate-950 sm:text-6xl lg:text-7xl">
            AI Resume Optimizer
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
            Turn raw experience into polished, role-specific resume bullets and interview talking
            points.
          </p>
          <div className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              href="/resume"
              className="inline-flex h-12 items-center justify-center rounded-md bg-slate-950 px-6 text-base font-semibold text-white shadow-sm transition-colors hover:bg-slate-800"
            >
              Start Optimizing
            </Link>
            <a
              href="#features"
              className="inline-flex h-12 items-center justify-center rounded-md border border-slate-300 bg-white px-6 text-base font-semibold text-slate-900 shadow-sm transition-colors hover:bg-slate-100"
            >
              View Features
            </a>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="scroll-mt-6 border-y border-slate-200 bg-white px-6 py-16 lg:px-8"
      >
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-700">
              Features
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl">
              Everything you need for a stronger resume
            </h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h3 className="text-xl font-semibold text-slate-950">{feature.title}</h3>
                <p className="mt-4 text-base leading-7 text-slate-600">{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-700">
              How It Works
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl">
              From upload to action plan in minutes
            </h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {steps.map((item) => (
              <article
                key={item.step}
                className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
              >
                <p className="text-sm font-semibold text-indigo-700">{item.step}</p>
                <h3 className="mt-4 text-xl font-semibold text-slate-950">{item.title}</h3>
                <p className="mt-4 text-base leading-7 text-slate-600">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white px-6 py-8 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-semibold text-slate-950">AI Resume Optimizer</p>
          <p>Copyright 2026 AI Resume Optimizer. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
