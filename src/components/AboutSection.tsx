import { aboutSection } from '#/content/copy'

export function AboutSection() {
  return (
    <section
      id="sobre"
      className="scroll-mt-20 bg-white py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Left Column: Image Collage from reference */}
          <div className="flex justify-center lg:col-span-5">
            <div className="relative h-[420px] w-full max-w-md sm:h-[460px]">
              <div
                aria-hidden="true"
                className="absolute -right-3 top-4 h-32 w-32 rotate-6 rounded-3xl bg-teal-100/70"
              />
              <div className="absolute left-0 top-0 h-[62%] w-[68%] overflow-hidden rounded-2xl shadow-xl ring-4 ring-white">
                <img
                  src="/about-team.jpg"
                  alt="Equipa Ethos Consulting em consultoria e acompanhamento"
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <div className="absolute bottom-0 right-0 h-[62%] w-[72%] overflow-hidden rounded-2xl shadow-2xl ring-4 ring-white">
                <img
                  src="/about-team-2.jpg"
                  alt="Equipa Ethos Consulting a analisar dados em conjunto"
                  className="h-full w-full object-cover object-center"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Copy, Checkpoints, Call Prompt & CTAs */}
          <div className="lg:col-span-7">
            <p className="text-xs font-bold uppercase tracking-wider text-[#138275] sm:text-sm">
              {aboutSection.tagline}
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#16282e] sm:text-3xl lg:text-4xl lg:leading-tight">
              {aboutSection.title}
            </h2>

            <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600 sm:text-base">
              {aboutSection.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>

            {/* Checklist with teal circle checkmarks */}
            <ul className="mt-6 space-y-3">
              {aboutSection.checkpoints.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <svg
                    className="mt-0.5 h-5 w-5 shrink-0 text-[#138275]"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-xs font-medium leading-snug text-slate-700 sm:text-sm">
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            {/* Direct Call question line */}
            <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-slate-700">
              <span className="font-medium">{aboutSection.contactPrompt}</span>
              <a
                href={`tel:${aboutSection.phone.replace(/\s+/g, '')}`}
                className="font-bold text-[#138275] hover:underline"
              >
                {aboutSection.phone}
              </a>
            </div>

            {/* Divider line */}
            <div className="my-6 border-b border-slate-100" />

            {/* Dual CTA buttons matching reference design */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#marcar-consulta"
                className="inline-flex items-center justify-center rounded-md bg-[#138275] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0f6f63]"
              >
                {aboutSection.primaryCtaSub}
              </a>
              <a
                href="#metodologia"
                className="inline-flex items-center justify-center rounded-md border border-[#138275] bg-[#eef7f6]/60 px-6 py-3 text-sm font-semibold text-[#138275] transition-colors hover:bg-[#eef7f6]"
              >
                {aboutSection.secondaryCta}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
