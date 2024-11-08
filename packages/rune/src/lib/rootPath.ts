// For any changes to this file, `cjs/lib/rootPath.js` needs to be manually updated
// accordingly as import.meta/__dirname are not mutually compatible and TSC will
// just error out (hence the @ts-ignore)

import path from "path"
import url from "url"

// @ts-ignore
const dirname = path.dirname(url.fileURLToPath(import.meta.url))

export const rootPath = path.resolve(dirname, "../..")
