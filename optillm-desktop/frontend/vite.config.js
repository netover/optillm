import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Output directory for the build artifacts, relative to the frontend root.
    // This will place the built files in `backend/app/static`.
    outDir: '../backend/app/static',
    // Ensure the output directory is cleaned before each build.
    emptyOutDir: true,
  },
  // Set the base path for assets. Using a relative path ensures the app
  // works correctly when served from the root of the executable's web server.
  base: './'
})
