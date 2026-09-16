import { officeLocations, siteInfo } from '#/content/copy'

const locationIcons = [PinIcon, MapIcon, GlobeIcon]

function lineIcon(href?: string) {
  if (!href) return null
  if (href.startsWith('mailto:')) return MailIcon
  if (href.startsWith('tel:')) return PhoneIcon
  return null
}

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[#0a1b29]">
      {/* Coverage strip: where ETHOS actually operates */}
      <div>
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 sm:grid-cols-3 sm:gap-6 sm:px-6 sm:py-14">
          {officeLocations.map((location, index) => {
            const Icon = locationIcons[index] ?? PinIcon
            return (
              <div
                key={location.name}
                className={`flex items-start gap-4 ${
                  index > 0 ? 'sm:border-l sm:border-white/10 sm:pl-6' : ''
                }`}
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/5">
                  <Icon className="h-6 w-6 text-[#50e29e]" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-white">
                    {location.name}
                  </p>
                  {location.lines.map((line) => {
                    const LineIcon = lineIcon(line.href)
                    const content = (
                      <>
                        {LineIcon ? (
                          <LineIcon className="h-3.5 w-3.5 shrink-0" />
                        ) : null}
                        {line.text}
                      </>
                    )

                    return (
                      <p
                        key={line.text}
                        className="mt-1.5 flex items-center gap-1.5 text-sm text-slate-300"
                      >
                        {line.href ? (
                          <a
                            href={line.href}
                            className="flex items-center gap-1.5 transition-colors hover:text-[#50e29e]"
                          >
                            {content}
                          </a>
                        ) : (
                          content
                        )}
                      </p>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Copyright bar */}
      <div className="bg-[#10603b] py-5">
        <p className="px-4 text-center text-xs text-white/90 sm:px-6">
          Copyright © {year} {siteInfo.name}. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}

function PinIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  )
}

function MapIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 4 3 6.5v13L9 17l6 2.5 6-2.5v-13L15 6.5 9 4Z" />
      <path d="M9 4v13M15 6.5v13" />
    </svg>
  )
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 6.5 8 6 8-6" />
    </svg>
  )
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6.5 3.5 9 6c.4.9.2 2-.5 2.7L7 10c1 2.3 2.7 4 5 5l1.3-1.5c.7-.7 1.8-.9 2.7-.5l2.5 2.5c.6.6.6 1.5.1 2.1-1 1.2-2.6 2-4.4 1.7-4-.6-8.3-4.9-8.9-8.9-.3-1.8.5-3.4 1.7-4.4.6-.5 1.5-.5 2.1.1Z" />
    </svg>
  )
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.2 2.3 3.4 5.2 3.4 8.5s-1.2 6.2-3.4 8.5c-2.2-2.3-3.4-5.2-3.4-8.5S9.8 5.8 12 3.5Z" />
    </svg>
  )
}
