//https://nitro.unjs.io/config
export default defineNitroConfig({
  srcDir: "server",
  preset: "netlify",
  output: {},
  imports: {
    // disable auto-imports to make type inference work with trpc and be faster
    // https://nitro.build/guide/utils#manual-imports
    autoImport: false,
  },
});
