import type { Plugin } from "vite"
import path from "node:path"
import { terserPlugin } from "./terser.js"
import { ViteRunePluginOptions } from "../index.js"
import { normalizeId } from "../lib/normalizeId.js"

export function getBuildLogicPlugin(
  options: ViteRunePluginOptions,
  logicPath: string
): Plugin[] {
  return [
    {
      name: "vite:rune-plugin:build",
      apply: "build",
      outputOptions: (options) => ({
        ...options,
        generatedCode: "es5",
        // Force logic.js chunk to be named so.
        chunkFileNames: (chunkInfo) => {
          if (chunkInfo.name === "logic") {
            return "logic.js"
          }
          return typeof options.chunkFileNames === "function"
            ? options.chunkFileNames(chunkInfo)
            : options.chunkFileNames!
        },
        // Force all logic related code into a logic.js chunk.
        manualChunks: (id, { getModuleInfo }) => {
          const moduleInfo = getModuleInfo(id)

          const platformAgnosticId = normalizeId(id)

          const platformAgnosticLogicPath = logicPath.split(path.sep).join("/")
          const platformAgnosticImporters = moduleInfo
            ? moduleInfo.importers.map((importer: string) =>
                importer.split(path.sep).join("/")
              )
            : []

          if (
            platformAgnosticId === platformAgnosticLogicPath ||
            platformAgnosticImporters.includes(platformAgnosticLogicPath)
          ) {
            return "logic"
          }
        },
      }),
    },
    terserPlugin(options.minifyLogic ?? false),
  ]
}
