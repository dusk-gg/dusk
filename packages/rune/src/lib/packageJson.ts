import fs from "fs"
import path from "path"

import { rootPath } from "./rootPath.js"

export const packageJson: { version: string } = JSON.parse(
  fs.readFileSync(path.resolve(rootPath, "package.json"), "utf8")
)
