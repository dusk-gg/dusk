import fs from "fs"
import mime from "mime-types"
import path from "path"

export function prepareFileUpload(filePath: string) {
  return {
    name: path.basename(filePath),
    content: fs.readFileSync(filePath),
    type: mime.lookup(filePath) || "application/octet-stream",
  }
}
