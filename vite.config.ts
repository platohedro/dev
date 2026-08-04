import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'

/*
 * Resolve project root in ESM environments.
 *
 * Historically Node.js scripts used `__dirname` to compute filesystem
 * paths. In ESM `__dirname` is not available. Using `fileURLToPath`
 * with `import.meta.url` is the recommended, cross-platform way to
 * obtain the current file path and derive the directory name. This
 * approach is compatible with Vite's native config loader and avoids
 * warnings about unsupported globals when `configLoader: 'native'`
 * becomes the default.
 */
const __filename = fileURLToPath(import.meta.url)
const projectRoot = path.dirname(__filename)


function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
        if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(projectRoot, 'src/assets', filename)
      }
    },
  }
}

export default defineConfig({
  plugins: [
    figmaAssetResolver(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
      alias: {
      // Alias @ to the src directory
      '@': path.resolve(projectRoot, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
