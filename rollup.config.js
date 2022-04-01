import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";

export default {
  input: "./src/cli.ts",
  output: [
    {
      file: "./build/cli/index.js",
      format: "esm",
      banner: "#!/usr/bin/env node\n",
    },
  ],
  plugins: [typescript(), nodeResolve(), commonjs()],
  external: ["fs/promises"],
};
