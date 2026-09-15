import { useState } from 'react'

import { quickBusinessStepsSection } from '#/content/copy'

export function MethodologySection() {
  const [activeStepId, setActiveStepId] = useState(
    quickBusinessStepsSection.steps[0].id,
  )

  const activeStep =
    quickBusinessStepsSection.steps.find((s) => s.id === activeStepId) ??
    quickBusinessStepsSection.steps[0]

  return (
    <section
      id="metodologia"
      className="scroll-mt-20 bg-white py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-[#138275] sm:text-sm">
            {quickBusinessStepsSection.tagline}
          </p>
          <h2 className="mx-auto mt-2 max-w-2xl text-2xl font-extrabold tracking-tight text-[#16282e] sm:text-3xl lg:text-4xl">
            {quickBusinessStepsSection.title}
          </h2>
        </div>

        {/* Clickable Step Tabs */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6 sm:mt-12">
          {quickBusinessStepsSection.steps.map((step) => {
            const isActive = step.id === activeStep.id

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setActiveStepId(step.id)}
                className={`flex items-start gap-4 rounded-xl p-5 text-left transition-all sm:p-6 cursor-pointer ${
                  isActive
                    ? 'border border-[#138275] bg-[#138275] text-white'
                    : 'border border-slate-200/90 bg-white text-slate-800 hover:border-slate-300'
                }`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                    isActive ? 'text-white' : 'text-[#138275]'
                  }`}
                >
                  <StepDiamondIcon />
                </div>
                <div>
                  <h3
                    className={`text-base font-bold tracking-tight sm:text-lg ${
                      isActive ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {step.title}
                  </h3>
                  <p
                    className={`mt-1 text-xs leading-relaxed ${
                      isActive ? 'text-teal-100' : 'text-slate-500'
                    }`}
                  >
                    {step.subtitle}
                  </p>
                </div>
              </button>
            )
          })}
        </div>

        {/* Tab Detail Card Panel */}
        <div className="mt-6 rounded-2xl border border-slate-200/90 bg-white p-6 sm:mt-8 sm:p-8 lg:p-10">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
            {/* Left Photo */}
            <div className="lg:col-span-5">
              <div className="relative h-[260px] w-full overflow-hidden rounded-xl bg-slate-100 sm:h-[300px]">
                <img
                  src={activeStep.image}
                  alt={activeStep.detailHeading}
                  className="h-full w-full object-cover object-center"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1.5 bg-[#16282e]"
                />
              </div>
            </div>

            {/* Right Details */}
            <div className="flex flex-col justify-center lg:col-span-7">
              <h3 className="text-2xl font-extrabold tracking-tight text-[#16282e] sm:text-3xl">
                {activeStep.detailHeading}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                {activeStep.detailDescription}
              </p>

              {/* Bullet points */}
              <div className="mt-5 space-y-3">
                {activeStep.points.map((pt) => (
                  <p
                    key={pt.label}
                    className="text-xs leading-relaxed sm:text-sm text-slate-700"
                  >
                    <strong className="font-bold text-[#16282e]">
                      {pt.label}{' '}
                    </strong>
                    <span>{pt.text}</span>
                  </p>
                ))}
              </div>

              {/* CTA button */}
              <div className="mt-6">
                <a
                  href="#marcar-consulta"
                  className="inline-flex items-center justify-center rounded-md border border-[#138275] bg-[#eef7f6]/60 px-6 py-2.5 text-sm font-semibold text-[#138275] transition-colors hover:bg-[#eef7f6]"
                >
                  {quickBusinessStepsSection.ctaButton}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* Vector SVG: Concentric Geometric Diamond */
function StepDiamondIcon() {
  return (
    <svg
      className="h-7 w-7"
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 3L3 16l13 13 13-13L16 3z" />
      <path d="M16 8l-8 8 8 8 8-8-8-8z" />
      <path d="M16 13l-3 3 3 3 3-3-3-3z" />
      <path d="M8 16h16" />
    </svg>
  )
}
