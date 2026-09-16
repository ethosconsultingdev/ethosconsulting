import { createFileRoute, notFound } from '@tanstack/react-router'

import { getWordPressPost } from '#/server/wordpress.functions'

export const Route = createFileRoute('/artigos/$slug')({
  ssr: true,
  loader: async ({ params }) => {
    const post = await getWordPressPost({ data: { slug: params.slug } })
    if (!post) throw notFound()
    return post
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title || 'Artigo'} — ETHOS CONSULTING` },
      { name: 'description', content: loaderData?.excerpt || '' },
    ],
  }),
  component: ArticlePage,
})

function ArticlePage() {
  const post = Route.useLoaderData()

  return (
    <article className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
      <a
        href="/#blog"
        className="text-sm font-semibold text-[#157f4d] hover:underline"
      >
        Voltar aos artigos
      </a>
      <header className="mt-6">
        <p className="text-sm font-medium text-slate-500">
          {post.date} · Por {post.author}
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0a1b29] sm:text-5xl">
          {post.title}
        </h1>
      </header>
      {post.image ? (
        <img
          src={post.image}
          alt={post.imageAlt}
          className="mt-10 aspect-[16/9] w-full rounded-2xl object-cover"
        />
      ) : null}
      <div
        className="wordpress-content mt-10"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />
    </article>
  )
}
