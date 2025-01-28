import { defineConfig } from 'tsup'

export default defineConfig({
  bundle: true,
  entry: ['src/index.ts'],
  format: 'esm',
  outDir: 'netlify/functions',
  clean: true,
  // make sure to bundle internal monorepo deps
  noExternal: [/^@internal\/.*$/],
  cjsInterop: true,
})
