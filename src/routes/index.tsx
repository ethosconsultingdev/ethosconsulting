import { createFileRoute } from '@tanstack/react-router'

import { Hero } from '#/components/Hero'
import { AboutSection } from '#/components/AboutSection'
import { StatsBanner } from '#/components/StatsBanner'
import { MethodologySection } from '#/components/MethodologySection'
import { FaqSection } from '#/components/FaqSection'
import { BlogSection } from '#/components/BlogSection'
import { FinalCtaSection } from '#/components/FinalCtaSection'

export const Route = createFileRoute('/')({
  // Full-document SSR: this is the primary marketing page, so it should be
  // crawlable and fast on first paint. (Default is `true`; stated
  // explicitly here to make the per-route choice visible — contrast with
  // `src/routes/simulador.tsx`, which opts into `ssr: false`.)
  ssr: true,
  component: HomePage,
})

function HomePage() {
  return (
    <>
      <Hero />
      <AboutSection />
      <StatsBanner />
      <MethodologySection />
      <FaqSection />
      <BlogSection />
      <FinalCtaSection />
    </>
  )
}
