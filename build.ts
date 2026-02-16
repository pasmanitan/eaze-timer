await Bun.build({
  entrypoints: ["./src/index.html"],
  outdir: "./dist",
  splitting: true,
  minify: true,
});
