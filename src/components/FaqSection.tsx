import { useState } from 'react'

import { faq, faqTagline, faqTitle } from '#/content/copy'
import type { HomePageContent } from '#/server/wordpress.types'

export function FaqSection({ content }: { content?: HomePageContent['faq'] }) {
  const faqContent =
    content ||
    ({
      tagline: faqTagline,
      title: faqTitle,
      image: {
        url: '/faq-team.jpg',
        alt: 'Equipa Ethos Consulting a esclarecer uma dúvida',
      },
      items: faq.map((item, index) => ({ id: index, ...item })),
    } satisfies HomePageContent['faq'])
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section
      id="faq"
      className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-24"
    >
      {/* Subtle diagonal background bands */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 1200 600"
        fill="none"
        preserveAspectRatio="none"
      >
        <polygon points="0,0 820,0 620,600 0,600" fill="#f8fafc" />
        <polygon points="900,0 1000,0 800,600 700,600" fill="#f1f5f9" />
      </svg>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Left Column: Photo */}
          <div className="lg:col-span-5">
            <div className="overflow-hidden rounded-2xl">
              <img
                src={faqContent.image.url}
                alt={faqContent.image.alt}
                className="h-full max-h-[520px] w-full object-cover object-center"
              />
            </div>
          </div>

          {/* Right Column: Tagline, Title & Accordion */}
          <div className="lg:col-span-7">
            <p className="text-xs font-bold uppercase tracking-wider text-[#138275] sm:text-sm">
              {faqContent.tagline}
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#16282e] sm:text-3xl lg:text-4xl">
              {faqContent.title}
            </h2>

            <div className="mt-8 space-y-3">
              {faqContent.items.map((item, index) => {
                const isOpen = index === openIndex

                return (
                  <div
                    key={item.id}
                    className={`rounded-xl border bg-white p-5 transition-colors ${
                      isOpen
                        ? 'border-[#138275]/30 shadow-md'
                        : 'border-slate-200/90'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? -1 : index)}
                      className="flex w-full cursor-pointer items-center justify-between gap-4 text-left"
                      aria-expanded={isOpen}
                    >
                      <span className="flex items-baseline gap-2.5">
                        <span className="text-sm font-bold text-[#138275]">
                          {String(index + 1).padStart(2, '0')}.
                        </span>
                        <span className="text-sm font-bold text-[#16282e] sm:text-base">
                          {item.question}
                        </span>
                      </span>
                      <ChevronIcon
                        className={`h-4 w-4 shrink-0 text-[#138275] transition-transform ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen ? (
                      <p className="mt-3 pl-[26px] text-xs leading-relaxed text-slate-600 sm:text-sm">
                        {item.answer}
                      </p>
                    ) : null}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}
