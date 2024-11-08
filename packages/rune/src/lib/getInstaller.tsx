import { execSync } from "child_process"

import { storage } from "./storage/storage.js"

export function getInstaller() {
  const cached = storage.get("installer")

  if (cached === undefined) {
    const installer = (() => {
      try {
        if (execSync(`npm list -g rune`).toString().includes(`rune`)) {
          return "npm"
        }
        // eslint-disable-next-line no-empty
      } catch (e) {}

      try {
        if (execSync(`yarn global list`).toString().includes(`rune`)) {
          return "yarn"
        }
        // eslint-disable-next-line no-empty
      } catch (e) {}

      return null
    })()

    storage.set("installer", installer)

    return installer
  }

  return cached
}
