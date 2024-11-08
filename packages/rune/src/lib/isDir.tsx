import fs from "fs"

export function isDir(dir: string) {
  return fs.existsSync(dir) && fs.statSync(dir).isDirectory()
}
