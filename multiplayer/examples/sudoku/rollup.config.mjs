import typescript from "@rollup/plugin-typescript"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"

export default [
  {
    input: "src/logic/logic.ts",
    output: { file: "public/logic.js", format: "es" },
    plugins: [
      nodeResolve(),
      commonjs(),
      typescript({ tsconfig: "./tsconfig-logic.json" }),
    ],
  },
]
