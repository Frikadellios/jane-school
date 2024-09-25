import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import legacy from '@vitejs/plugin-legacy'
import { defineConfig } from 'astro/config'
import rehypeExternalLinks from 'rehype-external-links'
import AutoImport from 'unplugin-auto-import/astro'
import { remarkReadingTime } from './src/utils/readTime.ts'

import path from 'node:path'
import tailwind from '@astrojs/tailwind'
import postCssOklabPolyfill from '@csstools/postcss-oklab-function'
import autoprefixer from 'autoprefixer'
import cssDiscardComments from 'postcss-discard-comments'
import tailwindcss from 'tailwindcss'
import tailwindcssNesting from 'tailwindcss/nesting'

export default defineConfig({
  output: 'server',
  prefetch: {
    prefetchAll: true
  },
  vite: {
    css: {
      postcss: {
        plugins: [
          tailwindcssNesting(),
          tailwindcss({
            config: path.resolve(import.meta.dirname, 'tailwind.config.ts')
          }),
          postCssOklabPolyfill({ preserve: true }),
          autoprefixer(),
          cssDiscardComments({ removeAll: true })
        ]
      }
    },
    plugins: [
      legacy({
        targets: ['defaults', 'not IE 11']
      })
    ]
  },
  integrations: [
    tailwind({
      nesting: true,
      applyBaseStyles: false
    }),
    AutoImport({
      defaultExportByFilename: false,
      include: [/\.[tj]sx?$/, /\.md$/],
      packagePresets: ['detect-browser-es'],
      imports: ['react', 'react-router'],
      viteOptimizeDeps: true,
      injectAtEnd: true,
      dirs: ['./src/utils/*.ts', './src/hooks'],
      dts: './src/auto-imports.d.ts'
    }),
    react(),
    mdx()
  ],
  markdown: {
    rehypePlugins: [
      [
        rehypeExternalLinks,
        {
          content: { type: 'text', value: ' 🔗' },
          target: '_blank',
          rel: ['nofollow', 'noreferrer']
        }
      ]
    ],
    remarkPlugins: [remarkReadingTime],
    shikiConfig: {
      theme: 'github-dark-dimmed',
      wrap: true
    },
    gfm: true
  }
})
