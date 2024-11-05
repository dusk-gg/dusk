import React, { useEffect } from "react"

import { Step } from "../components/Step.js"
import { storage } from "../lib/storage/storage.js"

export function Logout() {
  const loggedIn = !!storage.get("authToken")

  useEffect(() => {
    if (loggedIn) storage.delete("authToken")
  }, [loggedIn])

  return (
    <Step
      status={loggedIn ? "success" : "error"}
      label={loggedIn ? "Logged out successfully" : "You’re not logged in"}
    />
  )
}
