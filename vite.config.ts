import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    nitro({
      // Deployment target lives entirely in this one option. The route tree,
      // loaders, server functions and SSR modes above are unaffected by it —
      // swap 'cloudflare_module' for 'node-server', 'vercel', 'netlify', etc.
      // (see nitro's preset list) to retarget the runtime without touching
      // any application code.
      preset: 'cloudflare_module',
      rollupConfig: { external: [/^@sentry\//] },
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
})

export default config
