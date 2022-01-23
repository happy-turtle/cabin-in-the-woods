const { exec } = require("child_process");

exec("tsc", (error, stdout, stderror) => {
  // if any error while executing
  if (error) {
    console.error("Error: ", error);
    return;
  }

  console.log("compiled with tsc");
  console.log(stdout); // output from stdout
  console.error(stderror); // std errors

  require("esbuild")
    .build({
      entryPoints: [".//src/main.ts"],
      bundle: true,
      outfile: "/public/src/main.js",
      minify: true,
      format: "esm",
      target: ["esnext"],
    })
    .catch(() => process.exit(1))
    .then(console.log("bundled with esbuild"));
});
