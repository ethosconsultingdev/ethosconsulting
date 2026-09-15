import { impactMetrics } from '#/content/copy'

export function StatsBanner() {
  return (
    <section className="bg-white pb-16 sm:pb-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Flat dark teal container with subtle geometric facets */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#0c2724] via-[#173f3a] to-[#0c2724] px-8 py-9 sm:px-12 sm:py-10 text-white">
          {/* Subtle full-width watermark facets, low-contrast against the gradient */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.06]"
            viewBox="0 0 1200 200"
            fill="none"
            preserveAspectRatio="none"
          >
            <polygon points="260,200 520,0 660,0 400,200" fill="#ffffff" />
            <polygon points="520,0 780,200 920,200 660,0" fill="#ffffff" />
            <polygon points="780,0 1040,200 1200,200 1200,60 940,0" fill="#ffffff" />
          </svg>

          {/* 3 Counter items in flat horizontal grid */}
          <div className="relative z-10 grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6 lg:gap-12">
            {impactMetrics.map((metric) => (
              <div
                key={metric.id}
                className="flex items-center gap-4 sm:justify-center"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center">
                  {metric.id === 'growth' ? (
                    <ChartGrowthIcon />
                  ) : metric.id === 'satisfaction' ? (
                    <CustomerSatisfactionIcon />
                  ) : (
                    <HappyCustomersIcon />
                  )}
                </div>
                <div>
                  <p className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                    {metric.value}
                  </p>
                  <p className="mt-0.5 text-xs font-bold tracking-wider text-slate-200 uppercase">
                    {metric.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* Vector SVG Icon 1: Ascending Bar Chart with Trend Arrow */
function ChartGrowthIcon() {
  return (
    <svg
      className="h-10 w-10 text-white shrink-0"
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 42h36" />
      <rect x="9" y="32" width="5" height="10" rx="0.5" />
      <rect x="17" y="24" width="5" height="18" rx="0.5" />
      <rect x="25" y="18" width="5" height="24" rx="0.5" />
      <rect x="33" y="12" width="5" height="30" rx="0.5" />
      <path d="M8 29l9-7 8 5 13-14" />
      <path d="M31 13h7v7" />
    </svg>
  )
}

/* Vector SVG Icon 2: Person with 3 Stars & Thumbs Up */
function CustomerSatisfactionIcon() {
  return (
    <svg
      className="h-10 w-10 text-white shrink-0"
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* 3 stars above */}
      <path d="M12 8.5l.8 1.6 1.8.3-1.3 1.3.3 1.8-1.6-.8-1.6.8.3-1.8-1.3-1.3 1.8-.3z" />
      <path d="M21 6l.8 1.6 1.8.3-1.3 1.3.3 1.8-1.6-.8-1.6.8.3-1.8-1.3-1.3 1.8-.3z" />
      <path d="M30 8.5l.8 1.6 1.8.3-1.3 1.3.3 1.8-1.6-.8-1.6.8.3-1.8-1.3-1.3 1.8-.3z" />
      {/* Person head */}
      <circle cx="21" cy="22" r="5.5" />
      {/* Shoulder */}
      <path d="M10 40c0-6 4.5-9 11-9" />
      {/* Thumbs up hand */}
      <path d="M26 40h12a2.5 2.5 0 0 0 2.5-2.5v-6a2.5 2.5 0 0 0-2.5-2.5h-5.5v-3.5c0-2-1.5-3.5-3-3.5s-2 1.5-2 3.5v4l-4 4" />
      <rect x="23" y="32" width="4" height="9" rx="0.5" />
    </svg>
  )
}

/* Vector SVG Icon 3: Happy Customer Smiley */
function HappyCustomersIcon() {
  return (
    <svg
      className="h-10 w-10 text-white shrink-0"
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="24" cy="24" r="18" />
      <path d="M16 22c1.5-2 3.5-2 5 0" />
      <path d="M27 22c1.5-2 3.5-2 5 0" />
      <path d="M17 28c2 4 5 6 7 6s5-2 7-6" />
    </svg>
  )
}
