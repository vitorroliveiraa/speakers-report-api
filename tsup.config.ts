import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "./src/server.ts",
    "./src/database/migrations",
    "./src/database/seeds",
    "./src/database/knexfile.ts",
  ],
  outDir: "dist",
  target: "node16",
  format: ["cjs"],
  clean: true,
  tsconfig: "./tsconfig.json",
  sourcemap: true,
  dts: false,
  shims: true,
  splitting: false,
  metafile: true,
  silent: false,
  esbuildOptions(options) {
    options.alias = {
      "@database": "./src/database",
    };

    options.outbase = "./src";
  },
});
