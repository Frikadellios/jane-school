import * as path from 'node:path'
import { defineConfig, passthroughImageService, sharpImageService } from 'astro/config'
import { loadEnv } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import legacy from '@vitejs/plugin-legacy'

import rehypeExternalLinks from 'rehype-external-links'
import AutoImport from 'unplugin-auto-import/astro'
import { remarkReadingTime } from './src/utils/readTime.ts'

import tailwind from '@astrojs/tailwind'
import postCssOklabPolyfill from '@csstools/postcss-oklab-function'
import autoprefixer from 'autoprefixer'
import cssDiscardComments from 'postcss-discard-comments'
import tailwindcss from 'tailwindcss'
import tailwindcssNesting from 'tailwindcss/nesting'


import cloudflare from '@astrojs/cloudflare';


const ENV = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '')
const IS_PRODUCTION = ENV.NODE_ENV === 'production'

export default defineConfig({
  site: ENV.ASTRO_CONFIG_SITE_URL || 'localhost:4321',
  output: 'server',
  adapter: cloudflare({
    imageService: 'cloudflare',
    platformProxy: {
      enabled: true
    }
  }),
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport'
  },

  image: {
    service: IS_PRODUCTION ? sharpImageService() : passthroughImageService()
  },
  experimental: {
    contentCollectionCache: true
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
    ssr: {
      external: ['node:buffer', 'three']
    },
    plugins: [
      tsconfigPaths(),
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
