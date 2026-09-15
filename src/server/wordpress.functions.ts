import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

import {
  fetchContactPageContent,
  fetchHomePageContent,
  fetchLatestPosts,
  fetchPostBySlug,
  fetchServices,
} from './wordpress.server'

export const getLatestWordPressPosts = createServerFn({
  method: 'GET',
}).handler(() => fetchLatestPosts())

export const getWordPressPost = createServerFn({ method: 'GET' })
  .validator(z.object({ slug: z.string().trim().min(1).max(200) }))
  .handler(({ data }) => fetchPostBySlug(data.slug))

export const getHomePageContent = createServerFn({ method: 'GET' }).handler(
  () => fetchHomePageContent(),
)

export const getContactPageContent = createServerFn({ method: 'GET' }).handler(
  () => fetchContactPageContent(),
)

export const getServices = createServerFn({ method: 'GET' }).handler(() =>
  fetchServices(),
)
