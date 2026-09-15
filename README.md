# ETHOS CONSULTING — Landing Page

A TanStack Start app (file-based `@tanstack/react-router` + Tailwind CSS v4) for the ETHOS
CONSULTING landing page. Copy source: `ethos-landing-copy-pt.md`.

## WordPress CMS

The article feed and article pages use the WordPress REST API at
`https://admin.ethosconsultingmz.co.mz/wp-json/wp/v2`. Published posts are public, so no
credentials are required for normal production reads.

Copy `.env.example` to `.env` when a different API root or authenticated access is needed:

```bash
WORDPRESS_API_URL=https://admin.ethosconsultingmz.co.mz/wp-json/wp/v2
WORDPRESS_API_USERNAME=wordpress-username
WORDPRESS_API_PASSWORD=xxxx-xxxx-xxxx-xxxx
RESEND_API_KEY=re_xxxx
CONTACT_FROM_EMAIL=Website ETHOS <website@example.com>
CONTACT_TO_EMAIL=contacto@example.com
VITE_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
```

Keep the application password server-side. Never prefix these names with `VITE_`, because
Vite exposes variables with that prefix to browser code. The homepage falls back to the local
article cards if WordPress is temporarily unavailable.

WordPress content is read publicly in production. The Application Password is only needed for
local administration or future draft previews and should not be deployed. Contact submissions
are delivered through Resend; Turnstile is enabled whenever its site and secret keys are set.

## Where each requirement lives

| Requirement                   | Where                                                                                                                                                                                            |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| File-based routes             | `src/routes/` — `index.tsx` (`/`), `contacto.tsx`, `simulador.tsx`, `__root.tsx` (layout)                                                                                                        |
| Validated search params       | `src/routes/index.tsx` — `?hero=a\|b\|c\|d` picks a headline variant, `zod` schema with `.default()`/`.catch()` fallback                                                                         |
| Route loaders                 | `src/routes/index.tsx` `loader()` — kicks off the social-proof fetch                                                                                                                             |
| Typed server functions        | `src/server/*.functions.ts` — `createServerFn().validator(zodSchema).handler(...)`                                                                                                               |
| Explicit server-only boundary | `src/server/*.server.ts` (fs/DB-shaped logic, never imported by client code) vs. `*.functions.ts` (safe RPC wrappers) vs. `*.schema.ts` (client-safe, shared with the form)                      |
| Full-document SSR             | Default (`ssr: true`) on `/` and `/contacto` — see `src/routes/__root.tsx` for the HTML shell                                                                                                    |
| Streaming                     | `src/routes/index.tsx` returns an unawaited promise from `loader()`; `src/components/SocialProofSection.tsx` renders it with `<Await>`                                                           |
| Per-route SSR mode            | `/` and `/contacto` → `ssr: true` (SEO-relevant, fast first paint); `/simulador` → `ssr: false` (personalised, interactive-only quiz, no SEO value) — see comments in `src/routes/simulador.tsx` |
| Deployment target             | `vite.config.ts` → `nitro({ preset: 'cloudflare_module' })` for Cloudflare Workers.                                                                                                              |

The contact form validates on the client and server, verifies Cloudflare Turnstile when
configured, and sends notifications through Resend. See `src/server/inquiries.server.ts`.

# Getting Started

To run this application:

```bash
pnpm install
pnpm dev
```

# Building For Production

To build this application for production:

```bash
pnpm build
```

## Styling

This project uses [Tailwind CSS](https://tailwindcss.com/) for styling.

### Removing Tailwind CSS

If you prefer not to use Tailwind CSS:

1. Replace the Tailwind import in `src/styles.css` with your own styles
2. Remove `tailwindcss()` from the plugins array in `vite.config.ts`
3. Remove `@tailwindcss/vite` and `tailwindcss` from `package.json`

## Linting & Formatting

This project uses [eslint](https://eslint.org/) and [prettier](https://prettier.io/) for linting and formatting. Eslint is configured using [tanstack/eslint-config](https://tanstack.com/config/latest/docs/eslint). The following scripts are available:

```bash
pnpm lint
pnpm format
pnpm check
```

## Deploy to Cloudflare Workers

Nitro generates the Worker entrypoint, static asset binding, and redirected Wrangler
configuration during the build.

```bash
pnpm build
pnpm preview:cloudflare
```

To verify the Worker bundle without uploading it:

```bash
pnpm build
pnpm exec wrangler deploy --dry-run
```

To deploy after configuring Cloudflare secrets:

```bash
pnpm deploy
```

## Routing

This project uses [TanStack Router](https://tanstack.com/router) with file-based routing. Routes are managed as files in `src/routes`.

### Adding A Route

To add a new route to your application just add a new file in the `./src/routes` directory.

TanStack will automatically generate the content of the route file for you.

Now that you have two routes you can use a `Link` component to navigate between them.

### Adding Links

To use SPA (Single Page Application) navigation you will need to import the `Link` component from `@tanstack/react-router`.

```tsx
import { Link } from '@tanstack/react-router'
```

Then anywhere in your JSX you can use it like so:

```tsx
<Link to="/about">About</Link>
```

This will create a link that will navigate to the `/about` route.

More information on the `Link` component can be found in the [Link documentation](https://tanstack.com/router/v1/docs/framework/react/api/router/linkComponent).

### Using A Layout

In the File Based Routing setup the layout is located in `src/routes/__root.tsx`. Anything you add to the root route will appear in all the routes. The route content will appear in the JSX where you render `{children}` in the `shellComponent`.

Here is an example layout that includes a header:

```tsx
import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'My App' },
    ],
  }),
  shellComponent: ({ children }) => (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <header>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
          </nav>
        </header>
        {children}
        <Scripts />
      </body>
    </html>
  ),
})
```

More information on layouts can be found in the [Layouts documentation](https://tanstack.com/router/latest/docs/framework/react/guide/routing-concepts#layouts).

## Server Functions

TanStack Start provides server functions that allow you to write server-side code that seamlessly integrates with your client components.

```tsx
import { createServerFn } from '@tanstack/react-start'

const getServerTime = createServerFn({
  method: 'GET',
}).handler(async () => {
  return new Date().toISOString()
})

// Use in a component
function MyComponent() {
  const [time, setTime] = useState('')

  useEffect(() => {
    getServerTime().then(setTime)
  }, [])

  return <div>Server time: {time}</div>
}
```

## API Routes

You can create API routes by using the `server` property in your route definitions:

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'

export const Route = createFileRoute('/api/hello')({
  server: {
    handlers: {
      GET: () => json({ message: 'Hello, World!' }),
    },
  },
})
```

## Data Fetching

There are multiple ways to fetch data in your application. You can use TanStack Query to fetch data from a server. But you can also use the `loader` functionality built into TanStack Router to load the data for a route before it's rendered.

For example:

```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/people')({
  loader: async () => {
    const response = await fetch('https://swapi.dev/api/people')
    return response.json()
  },
  component: PeopleComponent,
})

function PeopleComponent() {
  const data = Route.useLoaderData()
  return (
    <ul>
      {data.results.map((person) => (
        <li key={person.name}>{person.name}</li>
      ))}
    </ul>
  )
}
```

Loaders simplify your data fetching logic dramatically. Check out more information in the [Loader documentation](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading#loader-parameters).

# Learn More

You can learn more about all of the offerings from TanStack in the [TanStack documentation](https://tanstack.com).

For TanStack Start specific documentation, visit [TanStack Start](https://tanstack.com/start).
