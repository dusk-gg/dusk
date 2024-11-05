import { readFileSync } from "fs"
import { createRequire } from "node:module"

import { FileInfo } from "./getGameFiles.js"
import { validateGameFilesWithEval } from "./validateGameFiles.js"

const require = createRequire(import.meta.url)

export async function validateGameFilesInCLI(files: FileInfo[]) {
  const logicRunnerPath = require.resolve("rune-sdk/dist/logicRunner")
  const logicRunner = readFileSync(logicRunnerPath).toString()

  return validateGameFilesWithEval(logicRunner, files)
}
