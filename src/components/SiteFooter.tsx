import { footerLinks, officeLocations, siteInfo } from '#/content/copy'

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <section className="bg-gradient-to-br from-slate-50 via-slate-50 to-teal-50/60 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Office / coverage locations */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-8">
          {officeLocations.map((location) => (
            <div key={location.name}>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                {location.label}
              </p>
              <h3 className="mt-1 text-lg font-bold tracking-tight text-[#16282e]">
                {location.name}
              </h3>
              <div className="mt-3 w-12 border-t border-slate-300" />
              {location.lines.map((line) => (
                <p key={line.text} className="mt-2 text-sm text-slate-500">
                  {line.href ? (
                    <a
                      href={line.href}
                      className="transition-colors hover:text-[#138275] hover:underline"
                    >
                      {line.text}
                    </a>
                  ) : (
                    line.text
                  )}
                </p>
              ))}
            </div>
          ))}
        </div>

        {/* Footer bar: wordmark */}
        <div className="mt-12 rounded-2xl border border-slate-200/70 bg-white px-6 py-6 shadow-sm sm:px-8">
          <div className="flex items-center gap-2 font-bold tracking-tight text-slate-900">
            <span className="text-lg font-extrabold tracking-tight text-slate-900">
              ETHOS
            </span>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#138275]">
              Consulting
            </span>
          </div>

          {/* Copyright bar */}
          <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>
              Copyright © {siteInfo.name} {year}. Todos os direitos reservados.
            </p>
            <nav className="flex items-center gap-5">
              {footerLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="hover:text-slate-800"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </section>
  )
}
