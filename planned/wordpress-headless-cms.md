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

- The production frontend is live on Cloudflare Workers at `https://ethosconsultingmz.co.mz`.
- WordPress serves the homepage, contact page, services, methodology, FAQs, media, and articles through the public REST API.
- CPT UI and SCF definitions are source-controlled under `wordpress/`, and `pnpm cms:seed` updates the approved baseline content idempotently.
- The default `Hello world` post has been deleted. The article section stays hidden until a real article is published.
- Unverified impact metrics have been removed from the frontend, fallback content, seed script, and source-controlled SCF schema.
- Contact submissions use Turnstile and Resend, send a branded internal notification, and send a receipt to the visitor.
- Production contact details are `+258 84 613 8863`, `contacto@ethosconsultingmz.co.mz`, and Av. Salvador Allende, n.º 84, Maputo 1100.
- Local content remains only as a safe fallback when WordPress content is unavailable or invalid.

## Delivery Status

Phases 1-4 and 6-10 are complete for published production content. Phase 5 is complete except for authenticated draft preview. Production WordPress reads use short edge-cache TTLs, and contact submissions are limited to five attempts per IP per minute before Turnstile and Resend run.

## Post-Launch Roadmap

1. Add authenticated draft preview with a dedicated least-privilege WordPress user.
2. Complete the launch verification matrix for mobile layouts, fallback behavior, media alt text, and simulated WordPress outages.
3. Document and test WordPress database, uploads, CPT UI, and SCF backup and recovery procedures.
4. Publish the first approved article; the website must not display placeholder articles.
5. Reintroduce an impact section only after ETHOS supplies verified, attributable figures.

## Phase 1: WordPress Foundation (Complete)

1. Back up the WordPress database and files.
2. Correct the WordPress Site URL so both the site and home URLs use HTTPS.
3. Install and activate Custom Post Type UI.
4. Install and activate Secure Custom Fields.
5. Use CPT UI exclusively for post types and taxonomies.
6. Use SCF exclusively for field groups and page fields.
7. Enable REST API visibility for every frontend-facing content type and field group.
8. Export CPT UI and SCF definitions into the repository for recovery and repeatable setup.

SCF can also register post types, but that feature must not be used here because CPT UI owns that responsibility. Duplicate registration would make the schema difficult to maintain.

## Phase 2: Content Types (Complete)

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

## Phase 3: Homepage Fields (Complete)

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

## Phase 4: Contact Page Fields (Complete)

Create a WordPress page with the slug `contacto`. Attach an SCF field group named `Contact Page`.

- `seo_title`: text
- `heading`: text
- `intro`: textarea
- `success_heading`: text
- `success_message`: textarea
- `response_time_message`: text

Operational validation rules remain in application code. Editors will not control field limits, trusted destination addresses, API keys, or server behavior.

## Phase 5: Editor Experience (Preview Pending)

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
- Published-content editing is available; authenticated draft preview remains post-launch work.

Copy, images, articles, FAQs, services, and methodology steps will be editable without code. Structural design changes, new field types, and application logic will remain developer tasks.

## Phase 6: REST API Contract (Complete)

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

## Phase 7: Content Migration (Complete)

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

## Phase 8: Frontend Integration (Complete)

1. Add typed SCF schemas to the WordPress client.
2. Add fetchers for Homepage, Contact Page, Services, Methodology, FAQs, and Posts.
3. Fetch independent resources in parallel during server-side rendering.
4. Add request timeouts and bounded response sizes.
5. Pass CMS data into components through typed props instead of direct static imports.
6. Preserve local fallback values for missing or invalid CMS fields.
7. Preserve the existing section anchors and frontend routes.
8. Use responsive WordPress media sizes where available.
9. Preserve image alt text and safe article HTML handling.
10. Keep draft-preview support isolated from the public published-content flow.

Fixed layout constraints:

- Exactly two hero headline lines
- Four methodology steps
- Stable service slugs
- Stable anchors: `sobre`, `metodologia`, `faq`, `blog`, and `marcar-consulta`
- Stable routes: `/`, `/contacto`, `/simulador`, and `/artigos/$slug`

## Phase 9: Contact Delivery with Resend (Complete)

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

## Phase 10: Cloudflare Workers Deployment (Complete)

1. Change the Nitro deployment preset from `node-server` to `cloudflare_module`.
2. Add Wrangler as a development dependency.
3. Add a Wrangler configuration with the correct compatibility date and entrypoint.
4. Add preview and deployment scripts.
5. Store Resend and Turnstile secrets in Cloudflare.
6. Keep WordPress administrator credentials out of Cloudflare.
7. Deploy a preview Worker and test all SSR routes and server functions.
8. Cache successful public WordPress reads at the edge for 60 seconds, cache 404 responses for 10 seconds, and do not cache server errors.
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
- Apply Turnstile and a five-attempt-per-minute, per-IP Worker rate limit before sending contact email.
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
- Cloudflare production deployment works on desktop and mobile.
- `pnpm lint` passes.
- `pnpm exec tsc --noEmit` passes.
- `pnpm build` passes.
