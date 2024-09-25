import react from '@astrojs/react'
import mdx from '@astojs/mdx'
import { defineConfig } from 'astro/config'
import legacy from '@vitejs/plugin-legacy'


export default defineConfig({
  vite: {
    plugins: [
        legacy({
            targets: ['defaults', 'not IE 11'],
        }),
    ]
  },
  integrations: [react(), mdx()]
})
