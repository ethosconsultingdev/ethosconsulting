# WordPress Headless CMS Implementation Plan

## Objective

Make the ETHOS CONSULTING frontend easy for non-developers to manage through WordPress while preserving the existing TanStack Start design, type safety, server-side rendering, and reliable fallback content.

## Agreed Decisions

| Area              | Decision                                              |
| ----------------- | ----------------------------------------------------- |
| CMS               | WordPress at `https://admin.ethosconsultingmz.co.mz/` |
| Content types     | Custom Post Type UI (CPT UI)                          |
| Structured fields | Secure Custom Fields (SCF)                            |
| Content structure | Hybrid: page fields plus reusable CPT records         |
| Initial CMS scope | Homepage, contact page, and articles                  |
| Contact delivery  | Resend email                                          |
| Frontend hosting  | Cloudflare Workers                                    |
| Frontend domain   | `ethosconsultingmz.co.mz`                             |
| WordPress domain  | `admin.ethosconsultingmz.co.mz`                       |

## Current State

- The WordPress REST API is available at `/wp-json/wp/v2`.
- WordPress Application Password authentication has been tested successfully.
- WordPress currently contains only the default `Hello world` post and `Sample Page`.
- Only Akismet and Hello Dolly are installed, and both are inactive.
- The frontend already reads standard WordPress posts and provides `/artigos/$slug` article pages.
- Homepage sections other than articles still use local content from `src/content/copy.ts`.
- Contact submissions still use the local `.data/inquiries.jsonl` development store.
- Nitro currently targets `node-server`, not Cloudflare Workers.

## Phase 1: WordPress Foundation

1. Back up the WordPress database and files.
2. Correct the WordPress Site URL so both the site and home URLs use HTTPS.
3. Install and activate Custom Post Type UI.
4. Install and activate Secure Custom Fields.
5. Use CPT UI exclusively for post types and taxonomies.
6. Use SCF exclusively for field groups and page fields.
7. Enable REST API visibility for every frontend-facing content type and field group.
8. Export CPT UI and SCF definitions into the repository for recovery and repeatable setup.

SCF can also register post types, but that feature must not be used here because CPT UI owns that responsibility. Duplicate registration would make the schema difficult to maintain.

## Phase 2: Content Types

### Service

| Setting        | Value                                                    |
| -------------- | -------------------------------------------------------- |
| Post type key  | `service`                                                |
| REST base      | `services`                                               |
| Public         | Yes                                                      |
| Public archive | No                                                       |
| Show in REST   | Yes                                                      |
| Supports       | Title, editor, thumbnail, custom fields, page attributes |

SCF fields:

- `short_description`: textarea
- `active`: true/false
- `icon`: image or controlled choice

The WordPress title is the service name. The WordPress slug is the stable form value, such as `procurement-estrategico`.

### Methodology Step

| Setting        | Value                                            |
| -------------- | ------------------------------------------------ |
| Post type key  | `method_step`                                    |
| REST base      | `methodology`                                    |
| Public         | Yes                                              |
| Public archive | No                                               |
| Show in REST   | Yes                                              |
| Supports       | Title, thumbnail, custom fields, page attributes |

SCF fields:

- `subtitle`: text
- `detail_heading`: text
- `detail_description`: textarea
- `image_alt`: text
- `points`: repeater
- `points.label`: text
- `points.text`: textarea

The WordPress title is the tab title. Page order controls the step order.

### FAQ

| Setting        | Value                                 |
| -------------- | ------------------------------------- |
| Post type key  | `faq`                                 |
| REST base      | `faqs`                                |
| Public         | Yes                                   |
| Public archive | No                                    |
| Show in REST   | Yes                                   |
| Supports       | Title, custom fields, page attributes |

SCF fields:

- `answer`: textarea or restricted WYSIWYG

The WordPress title is the question. Page order controls display order.

### Articles

Articles continue using the standard WordPress `post` type with:

- Title
- Slug
- Excerpt
- Main content
- Featured image and alt text
- Author
- Publication date
- Categories

## Phase 3: Homepage Fields

Create a normal WordPress page with the slug `inicio`. Attach an SCF field group named `Homepage` and organize it into tabs.

### Hero Tab

- `hero_headline_line_1`: text
- `hero_headline_line_2`: text
- `hero_subtitle`: textarea
- `hero_image`: image returning an image object
- `hero_image_alt`: text
- `appointment_title`: text
- `appointment_subtitle`: text
- `appointment_button_label`: text

The two headline fields remain separate because the design deliberately renders exactly two headline lines.

### About Tab

- `about_tagline`: text
- `about_title`: text
- `about_paragraphs`: repeater of textarea fields
- `about_checkpoints`: repeater of text fields
- `about_contact_prompt`: text
- `about_phone`: text
- `about_primary_cta_label`: text
- `about_secondary_cta_label`: text
- `about_primary_image`: image object
- `about_primary_image_alt`: text
- `about_secondary_image`: image object
- `about_secondary_image_alt`: text

### Metrics Tab

- `metrics`: repeater
- `metrics.key`: controlled choice
- `metrics.value`: text
- `metrics.label`: text
- `metrics.icon`: controlled choice or image

The initial layout supports three metrics. Values remain formatted strings because examples include `2.6x`, `88.6%`, and `3M+`.

### Section Settings Tab

- `methodology_tagline`: text
- `methodology_title`: text
- `methodology_cta_label`: text
- `faq_tagline`: text
- `faq_title`: text
- `faq_image`: image object
- `faq_image_alt`: text
- `blog_tagline`: text
- `blog_title`: text
- `blog_feed_limit`: integer between 1 and 12
- `blog_read_more_label`: text

### Final CTA Tab

- `final_cta_tagline`: text
- `final_cta_title`: text
- `final_cta_button_label`: text
- `final_cta_microcopy`: text
- `final_cta_background`: image object

## Phase 4: Contact Page Fields

Create a WordPress page with the slug `contacto`. Attach an SCF field group named `Contact Page`.

- `seo_title`: text
- `heading`: text
- `intro`: textarea
- `success_heading`: text
- `success_message`: textarea
- `response_time_message`: text

Operational validation rules remain in application code. Editors will not control field limits, trusted destination addresses, API keys, or server behavior.

## Phase 5: Editor Experience

The WordPress interface must use Portuguese labels and clear instructions.

- Homepage copy is edited under `Páginas > Início`.
- Contact copy is edited under `Páginas > Contacto`.
- Articles are edited under `Artigos`.
- FAQs are edited under `Perguntas Frequentes`.
- Methodology records are edited under `Metodologia`.
- Services are edited under `Serviços`.
- Technical field names, REST bases, credentials, and internal IDs are hidden from content editors.
- Required fields have validation and concise guidance.
- Image fields include recommended dimensions and required alt-text instructions.
- Fixed section layouts prevent accidental design breakage.
- Draft preview is available before publication.

Copy, images, articles, FAQs, services, and methodology steps will be editable without code. Structural design changes, new field types, and application logic will remain developer tasks.

## Phase 6: REST API Contract

Expected public endpoints:

```text
/wp-json/wp/v2/pages?slug=inicio
/wp-json/wp/v2/pages?slug=contacto
/wp-json/wp/v2/services
/wp-json/wp/v2/methodology
/wp-json/wp/v2/faqs
/wp-json/wp/v2/posts
```

SCF field groups must enable `Show in REST API`. The exact SCF response shape must be verified after installing the plugin and creating a test field before finalizing the frontend schemas.

Public published content requests must not include WordPress administrator credentials. Application Password credentials stay local during setup and can later be replaced by a dedicated least-privilege integration account if authenticated previews are required.

## Phase 7: Content Migration

1. Upload the existing frontend images to the WordPress Media Library.
2. Add meaningful alt text to all content images.
3. Create and populate the `inicio` page.
4. Create and populate the `contacto` page.
5. Create the existing services with unchanged slugs.
6. Create the four existing methodology steps in the correct order.
7. Create the existing FAQs in the correct order.
8. Replace the default WordPress post and page with production content.
9. Verify every REST response before switching the frontend to CMS data.
10. Keep `src/content/copy.ts` as a safe fallback until production content is complete.

## Phase 8: Frontend Integration

1. Add typed SCF schemas to the WordPress client.
2. Add fetchers for Homepage, Contact Page, Services, Methodology, FAQs, and Posts.
3. Fetch independent resources in parallel during server-side rendering.
4. Add request timeouts and bounded response sizes.
5. Pass CMS data into components through typed props instead of direct static imports.
6. Preserve local fallback values for missing or invalid CMS fields.
7. Preserve the existing section anchors and frontend routes.
8. Use responsive WordPress media sizes where available.
9. Preserve image alt text and safe article HTML handling.
10. Add draft-preview support after the published-content flow is stable.

Fixed layout constraints:

- Exactly two hero headline lines
- Three homepage metrics
- Four methodology steps
- Stable service slugs
- Stable anchors: `sobre`, `metodologia`, `faq`, `blog`, and `marcar-consulta`
- Stable routes: `/`, `/contacto`, `/simulador`, and `/artigos/$slug`

## Phase 9: Contact Delivery with Resend

Replace the local filesystem inquiry store with a server-side Resend integration.

Required environment variables:

```env
RESEND_API_KEY=
CONTACT_FROM_EMAIL=
CONTACT_TO_EMAIL=
VITE_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
```

Implementation requirements:

- Validate every submission on the server.
- Add a hidden honeypot field.
- Verify Cloudflare Turnstile on the server.
- Send a structured notification email through Resend.
- Escape all user-provided values in email HTML.
- Never expose the Resend key or Turnstile secret to browser code.
- Return generic errors without exposing provider responses.
- Remove the `node:fs` dependency and local `.data` storage.
- Verify the Resend sending domain and DNS records before launch.

Inputs required for this phase:

- Ethos recipient email address
- Verified Resend sender address
- Resend API key
- Cloudflare Turnstile site and secret keys

## Phase 10: Cloudflare Workers Deployment

1. Change the Nitro deployment preset from `node-server` to `cloudflare_module`.
2. Add Wrangler as a development dependency.
3. Add a Wrangler configuration with the correct compatibility date and entrypoint.
4. Add preview and deployment scripts.
5. Store Resend and Turnstile secrets in Cloudflare.
6. Keep WordPress administrator credentials out of Cloudflare.
7. Deploy a preview Worker and test all SSR routes and server functions.
8. Configure conservative caching for public WordPress reads.
9. Connect `ethosconsultingmz.co.mz` to the Worker.
10. Keep `admin.ethosconsultingmz.co.mz` as the WordPress administration and API origin.

## Security and Reliability

- Use public unauthenticated REST requests for published content.
- Do not deploy the current administrator Application Password.
- Use a dedicated least-privilege integration user for future preview features.
- Do not expose secrets with `VITE_` prefixes; only the public Turnstile site key may use that prefix.
- Validate all WordPress responses with Zod before rendering.
- Retain safe local fallback content during WordPress outages.
- Restrict rich-text fields to locations that intentionally render WordPress HTML.
- Add spam protection and rate limiting before enabling the production form.
- Export CPT UI and SCF configuration after every schema change.

## Verification Checklist

- CPT UI and SCF are active and current.
- CPT definitions appear under `/wp-json/wp/v2/types`.
- SCF fields appear in public REST responses.
- Homepage renders CMS content with SSR.
- Contact page renders CMS content with SSR.
- Service, FAQ, and methodology ordering is deterministic.
- Missing fields fall back safely without breaking layout.
- WordPress downtime does not take down the homepage.
- Article list and individual article routes work.
- Featured images and alt text render correctly.
- Draft content is not exposed publicly.
- Resend sends valid inquiries to the configured recipient.
- Invalid and spam submissions are rejected.
- Cloudflare preview works on desktop and mobile.
- `pnpm lint` passes.
- `pnpm exec tsc --noEmit` passes.
- `pnpm build` passes.

## Implementation Order

1. Back up and configure WordPress HTTPS.
2. Install CPT UI and SCF.
3. Define and export CPTs and SCF field groups.
4. Seed WordPress with the existing content and media.
5. Verify the REST contract.
6. Integrate Homepage and Contact Page data in the frontend.
7. Integrate Services, Methodology, and FAQs.
8. Add preview and fallback behavior.
9. Replace contact storage with Resend and Turnstile.
10. Convert Nitro to Cloudflare Workers.
11. Run full verification and deploy a preview.
12. Approve production content and switch DNS.
