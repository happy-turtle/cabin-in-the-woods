const { exec } = require("child_process");
const { esbuild } = require("esbuild");

const build = (watch) => {
  const esBuildSettings = {
    entryPoints: [".//src/main.ts"],
    bundle: true,
    outfile: "/public/src/main.js",
    minify: true,
    format: "esm",
    target: ["esnext"],
  };

  if (watch) {
    console.log("running esbuild in watch mode");
    esbuild.build({
      ...esBuildSettings,
      watch: {
        onRebuild(error, result) {
          if (error) console.error("esbuild failed:", error);
          else console.log("esbuild succeeded:", result);
        },
      },
    });
  } else {
    exec("tsc", (error, stdout, stderror) => {
      // if any error while executing
      if (error) {
        console.error("Error: ", error);
        return;
      }

      console.log("compiled with tsc");
      console.log(stdout); // output from stdout
      console.error(stderror); // std errors

      esbuild
        .build(esBuildSettings)
        .catch((e) => console.log(e))
        .then(console.log("bundled with esbuild"));
    });
  }
};

if (process.argv.includes("-w")) {
  build(true);
} else {
  build();
}
