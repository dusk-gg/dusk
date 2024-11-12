import path from "path"

import { getDataDir } from "./getDataDir.js"
import { Storage } from "./types.js"

const dataDir = getDataDir()

export function valuePath(key: keyof Storage) {
  return path.resolve(dataDir, `${key}.value`)
}
