import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { ReactLenis } from 'lenis/react'

import { SiteHeader } from '#/components/SiteHeader'
import { SiteFooter } from '#/components/SiteFooter'
import { siteInfo } from '#/content/copy'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: `${siteInfo.name} — ${siteInfo.tagline}`,
      },
      {
        name: 'description',
        content: siteInfo.description,
      },
    ],
    links: [
      {
        rel: 'preconnect',
        href: 'https://api.fontshare.com',
      },
      {
        rel: 'stylesheet',
        href: 'https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700,900&display=swap',
      },
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-MZ">
      <head>
        <HeadContent />
      </head>
      <body className="bg-white text-slate-900 antialiased">
        <ReactLenis root options={{ anchors: true }}>
          <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </ReactLenis>
        <Scripts />
      </body>
    </html>
  )
}
