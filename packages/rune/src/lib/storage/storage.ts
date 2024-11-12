import { serialize, deserialize } from "bson"
import fs from "fs"

import { packageJson } from "../packageJson.js"

import { Storage } from "./types.js"
import { valuePath } from "./valuePath.js"

export const storage = {
  get<T extends keyof Storage>(key: T) {
    try {
      return deserialize(fs.readFileSync(valuePath(key))).value as Storage[T]
    } catch (e) {
      return undefined
    }
  },
  set<T extends keyof Storage>(key: T, value: Storage[T]) {
    fs.writeFileSync(
      valuePath(key),
      serialize({ value, version: packageJson.version })
    )
  },
  delete(key: keyof Storage) {
    fs.writeFileSync(valuePath(key), "")
  },
}
