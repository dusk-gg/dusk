import fs from "fs"
import path from "path"

import { parseGameIndexHtml } from "../lib/validateGameFiles.js"

function isGameIndexPath(indexHtmlPath: string) {
  if (!fs.existsSync(indexHtmlPath)) return false

  const indexHtmlContent = fs.readFileSync(indexHtmlPath, "utf-8")

  const gameIndexHtmlElements = parseGameIndexHtml(indexHtmlContent)

  if (!gameIndexHtmlElements || !gameIndexHtmlElements.sdkScript) return false

  return true
}

export function findGameDir(dir: string) {
  const subPaths = ["", "/dist", "/build", "/dist/build", "/build/build"]

  for (const subPath of subPaths) {
    const indexPath = path.join(dir, subPath, "index.html")

    if (isGameIndexPath(indexPath)) {
      return path.join(dir, subPath)
    }
  }

  return dir
}
