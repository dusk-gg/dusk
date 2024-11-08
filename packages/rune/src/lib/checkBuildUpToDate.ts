import fs from "fs"
import path from "path"

import { getSourcePath } from "./getSourcePath.js"

// find the newest file in a directory
function findNewestFile(dir: string, currentNewestTime = 0): number {
  const files = fs.readdirSync(dir)

  // traverse the subdirectories if needed, otherwise
  // just compare the modification times
  for (const file of files) {
    const filePath = dir + path.sep + file
    const info = fs.statSync(filePath)

    if (info.isDirectory()) {
      currentNewestTime = findNewestFile(filePath, currentNewestTime)
    } else {
      currentNewestTime = Math.max(currentNewestTime, info.mtimeMs)
    }
  }

  return currentNewestTime
}

// check if the output is older than the source
export function buildOutOfDate(outputDirectory: string): boolean {
  // if the source directory isn't in the normal place then
  // don't try to perform this step.
  // Possible TODO: Have a look a project configuration files and determine where
  // the src directory is.
  const srcDirectory = getSourcePath(outputDirectory)

  if (!fs.existsSync(srcDirectory)) {
    return false
  }

  const newestOutputFile = findNewestFile(outputDirectory)
  const newestSourceFile = findNewestFile(srcDirectory)

  return newestSourceFile > newestOutputFile
}
