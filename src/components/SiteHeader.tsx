import { useState } from 'react'
import { Link } from '@tanstack/react-router'

import { topBarAnnouncement } from '#/content/copy'

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-white">
      {/* Top dark announcement banner matching reference design */}
      <div className="bg-[#16282e] px-4 py-2 text-center text-xs font-medium text-slate-200">
        <p className="mx-auto max-w-5xl truncate">{topBarAnnouncement}</p>
      </div>

      {/* Main navigation bar */}
      <div className="border-b border-slate-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
          <Link
            to="/"
            aria-label="ETHOS Consulting — Início"
            className="shrink-0"
          >
            <img
              src="/logo.png"
              alt="ETHOS Consulting"
              width={150}
              height={50}
              className="h-10 w-auto sm:h-12"
            />
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex">
            <Link
              to="/"
              className="flex items-center gap-1 text-[#138275] hover:text-[#0f6f63]"
            >
              Início
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
              </svg>
            </Link>
            <a href="/#sobre" className="hover:text-slate-900">
              Sobre Nós
            </a>
            <a href="/#metodologia" className="hover:text-slate-900">
              Metodologia
            </a>
            <a href="/#faq" className="hover:text-slate-900">
              FAQ
            </a>
            <Link to="/contacto" className="hover:text-slate-900">
              Contacto
            </Link>
          </nav>

          {/* Right Action Button & Mobile toggle */}
          <div className="flex items-center gap-3">
            <a
              href="#marcar-consulta"
              className="hidden rounded-md bg-[#138275] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0f6f63] sm:inline-flex"
            >
              Marcar Diagnóstico
            </a>

            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="rounded-md p-1.5 text-slate-700 hover:bg-slate-100 md:hidden"
              aria-label="Abrir menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                {mobileOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileOpen ? (
          <div className="border-t border-slate-100 bg-white px-6 py-4 md:hidden">
            <nav className="flex flex-col gap-3 text-sm font-medium text-slate-700">
              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className="text-[#138275]"
              >
                Início
              </Link>
              <a
                href="/#sobre"
                onClick={() => setMobileOpen(false)}
                className="hover:text-slate-900"
              >
                Sobre Nós
              </a>
              <a
                href="/#metodologia"
                onClick={() => setMobileOpen(false)}
                className="hover:text-slate-900"
              >
                Metodologia
              </a>
              <a
                href="/#faq"
                onClick={() => setMobileOpen(false)}
                className="hover:text-slate-900"
              >
                FAQ
              </a>
              <Link
                to="/contacto"
                onClick={() => setMobileOpen(false)}
                className="hover:text-slate-900"
              >
                Contacto
              </Link>
              <a
                href="#marcar-consulta"
                onClick={() => setMobileOpen(false)}
                className="mt-2 inline-block rounded-md bg-[#138275] px-4 py-2 text-center text-sm font-semibold text-white"
              >
                Marcar Diagnóstico
              </a>
            </nav>
          </div>
        ) : null}
      </div>
    </header>
  )
}
