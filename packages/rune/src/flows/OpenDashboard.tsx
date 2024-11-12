import { Box, Text } from "ink"
import open from "open"
import React, { useEffect, useState } from "react"

import { Choose } from "../components/Choose.js"
import { Step } from "../components/Step.js"
import { useDashboardMagicLink } from "../gql/useMagicDashboardLink.js"
import { formatApolloError } from "../lib/formatApolloError.js"

export function OpenDashboard() {
  const { createDashboardMagicLink, dashboardMagicLink, error } =
    useDashboardMagicLink()
  const [status, setStatus] = useState<
    "waiting" | "opened" | "failedBrowser" | "skipped"
  >("waiting")

  useEffect(() => {
    createDashboardMagicLink({})
  }, [createDashboardMagicLink])

  return (
    <Box flexDirection="column">
      {!error && !dashboardMagicLink && (
        <Step status="waiting" label="Opening..." />
      )}
      {error && <Text color="red">{formatApolloError(error, {})}</Text>}

      {!error && dashboardMagicLink && (
        <>
          <Text>
            Dashboard link: <Text color="green">{dashboardMagicLink}</Text>
          </Text>

          {status === "opened" ? (
            <Step status="success" label="Dashboard opened" />
          ) : status === "failedBrowser" ? (
            <Step
              status="error"
              label="Failed to open your default browser. Please open the link manually"
            />
          ) : status === "skipped" ? (
            <Step status="success" label="Done." />
          ) : (
            <Step
              status={"userInput"}
              label={"Open in default browser?"}
              view={
                <Choose
                  options={["Yes", "No"]}
                  onSubmit={(response) => {
                    const shouldOpen = response === "Yes"

                    if (shouldOpen) {
                      open(dashboardMagicLink)
                        .then(() => {
                          setStatus("opened")
                        })
                        .catch(() => {
                          setStatus("failedBrowser")
                        })
                    } else {
                      setStatus("skipped")
                    }
                  }}
                />
              }
            />
          )}
        </>
      )}
    </Box>
  )
}
