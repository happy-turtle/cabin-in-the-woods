console.log("running esbuild in watch mode");
require("esbuild").build({
  entryPoints: [".//src//main.ts"],
  bundle: true,
  outfile: "/public/src/main.js",
  minify: true,
  watch: {
    onRebuild(error, result) {
      if (error) console.error("esbuild failed:", error);
      else console.log("esbuild succeeded:", result);
    },
  },
  format: "esm",
  target: ["esnext"],
});
