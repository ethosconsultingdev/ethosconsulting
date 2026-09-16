import { Link } from '@tanstack/react-router'

import { finalCta } from '#/content/copy'
import type { HomePageContent } from '#/server/wordpress.types'

export function FinalCtaSection({
  content,
}: {
  content?: HomePageContent['finalCta']
}) {
  const cta =
    content ||
    ({
      tagline: finalCta.tagline,
      title: finalCta.title,
      buttonLabel: finalCta.cta,
      microcopy: finalCta.micro,
      backgroundImage: '/final-cta.jpg',
    } satisfies HomePageContent['finalCta'])

  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl">
          {/* Background photo */}
          <img
            src={cta.backgroundImage}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Dark navy gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a1b29]/95 via-[#112e45]/85 to-[#0a1b29]/90" />

          {/* Diagonal accent shapes */}
          <img
            src="/cta-bg-shape1-1.png"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover mix-blend-overlay"
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center px-6 py-20 text-center sm:px-12 sm:py-24">
            <p className="text-xs font-bold uppercase tracking-widest text-[#8decc0] sm:text-sm">
              {cta.tagline}
            </p>
            <h2 className="mt-3 max-w-2xl text-2xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-4xl">
              {cta.title}
            </h2>

            <Link
              to="/contacto"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#0a1b29] transition-colors hover:bg-slate-100"
            >
              {cta.buttonLabel}
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
            <p className="mt-4 text-xs text-slate-300">{cta.microcopy}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
