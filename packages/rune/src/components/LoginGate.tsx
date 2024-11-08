import { Box } from "ink"
import React, { ReactNode } from "react"

import { Login } from "../flows/Login.js"
import { useMe } from "../gql/useMe.js"

import { Step } from "./Step.js"

export function LoginGate({ children }: { children: ReactNode }) {
  const { me } = useMe()

  if (!me) {
    return <Login />
  }

  return (
    <Box flexDirection="column">
      <Step
        status="success"
        label={`Logged in as \`${me.displayName}\` (${me.email})`}
      />
      {children}
    </Box>
  )
}
