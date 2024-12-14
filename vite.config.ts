import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import mdx from '@mdx-js/rollup'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'

export default defineConfig({
  base: '/', // Set base URL for GitHub Pages
  plugins: [
    react(),
    mdx({
      remarkPlugins: [
        remarkFrontmatter,
        remarkGfm
      ]
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@content": path.resolve(__dirname, "./content")
    },
  },
  optimizeDeps: {
    include: ['front-matter']
  },
  assetsInclude: ['**/*.md'],
  publicDir: 'content',
  build: {
    outDir: 'dist',
  },
})

