import { setContext } from "@apollo/client/link/context/index.js"

import { packageJson } from "../lib/packageJson.js"
import { storage } from "../lib/storage/storage.js"

export const contextLink = setContext(() => {
  const authToken = storage.get("authToken")

  return {
    headers: {
      "X-Client-Version": packageJson.version,
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
    },
  }
})
