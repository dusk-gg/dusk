import figures from "figures"
import { Box, Text } from "ink"
import SpinnerImport from "ink-spinner"
import React, { ReactNode } from "react"

// @ts-ignore
const Spinner = SpinnerImport.default as typeof SpinnerImport

type StepStatus = "userInput" | "waiting" | "success" | "error"

export function Step({
  status,
  label,
  view,
}: {
  status: StepStatus
  label: ReactNode | ((status: StepStatus) => ReactNode)
  view?: ReactNode | ((status: StepStatus) => ReactNode)
}) {
  return (
    <Box flexDirection="column">
      <Box>
        <Text
          color={
            status === "success"
              ? "green"
              : status === "error"
                ? "red"
                : "yellow"
          }
        >
          {status === "waiting" ? (
            <>
              <Spinner />
              &nbsp;
            </>
          ) : (
            <Text>
              {status === "success"
                ? figures.tick
                : status === "error"
                  ? figures.cross
                  : figures.bullet}
              &nbsp;
            </Text>
          )}
          {typeof label === "function" ? label(status) : label}
        </Text>
      </Box>
      <Box paddingLeft={2}>
        {typeof view === "function" ? view(status) : view}
      </Box>
    </Box>
  )
}
