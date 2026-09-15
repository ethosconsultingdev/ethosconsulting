import { createFileRoute } from '@tanstack/react-router'

import { Hero } from '#/components/Hero'
import { AboutSection } from '#/components/AboutSection'
import { StatsBanner } from '#/components/StatsBanner'
import { MethodologySection } from '#/components/MethodologySection'
import { FaqSection } from '#/components/FaqSection'
import { BlogSection } from '#/components/BlogSection'
import { FinalCtaSection } from '#/components/FinalCtaSection'
import {
  getHomePageContent,
  getLatestWordPressPosts,
} from '#/server/wordpress.functions'

export const Route = createFileRoute('/')({
  // Full-document SSR: this is the primary marketing page, so it should be
  // crawlable and fast on first paint. (Default is `true`; stated
  // explicitly here to make the per-route choice visible — contrast with
  // `src/routes/simulador.tsx`, which opts into `ssr: false`.)
  ssr: true,
  loader: async () => {
    const [content, posts] = await Promise.allSettled([
      getHomePageContent(),
      getLatestWordPressPosts(),
    ])
    return {
      content: content.status === 'fulfilled' ? content.value : null,
      posts: posts.status === 'fulfilled' ? posts.value : [],
    }
  },
  component: HomePage,
})

function HomePage() {
  const { content, posts } = Route.useLoaderData()

  return (
    <>
      <Hero content={content?.hero} />
      <AboutSection content={content?.about} />
      <StatsBanner metrics={content?.metrics} />
      <MethodologySection content={content?.methodology} />
      <FaqSection content={content?.faq} />
      <BlogSection posts={posts} content={content?.blog} />
      <FinalCtaSection content={content?.finalCta} />
    </>
  )
}
