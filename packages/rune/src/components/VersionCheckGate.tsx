import fetch from "cross-fetch"
import { Box, Text } from "ink"
import React, { useEffect, ReactNode, useState } from "react"
import semver, { ReleaseType } from "semver"

import { getInstaller } from "../lib/getInstaller.js"
import { packageJson } from "../lib/packageJson.js"

import { Choose } from "./Choose.js"
import { Step } from "./Step.js"

const installYarn = "`yarn global add rune`"
const installNpm = "`npm install -g rune`"
const helpText = `Run ${
  getInstaller() === "yarn"
    ? installYarn
    : getInstaller() === "npm"
      ? installNpm
      : `${installNpm} or ${installYarn}`
} to install the latest version`

export function VersionCheckGate({ children }: { children: ReactNode }) {
  const [latestVersion, setLatestVersion] = useState<string | undefined>()
  const [loading, setLoading] = useState(true)
  const [diff, setDiff] = useState<ReleaseType | null>(null)
  const [skipped, setSkipped] = useState<boolean | undefined>()

  useEffect(() => {
    getLatestNpmVersion("rune")
      .then(setLatestVersion)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (latestVersion) setDiff(semver.diff(packageJson.version, latestVersion))
  }, [latestVersion])

  if (loading) {
    return <Step status="waiting" label="Checking latest CLI version" />
  }

  if (diff && skipped === undefined) {
    return (
      <Step
        status={diff === "major" ? "error" : "userInput"}
        label={`This CLI is out of date (installed: ${
          packageJson.version
        }, latest: ${latestVersion}).${
          diff !== "major" ? " Do you want to proceed anyway?" : ""
        }`}
        view={
          diff !== "major" ? (
            <Choose
              options={diff === "patch" ? ["Yes", "No"] : ["No", "Yes"]}
              onSubmit={(response) => setSkipped(response === "Yes")}
            />
          ) : (
            <Text color="red">{helpText}</Text>
          )
        }
      />
    )
  }

  if (skipped === false) return <Text>{helpText}</Text>

  return <Box flexDirection="column">{children}</Box>
}

function getLatestNpmVersion(npmPackage: string) {
  return fetch(`https://registry.npmjs.org/${npmPackage}/latest`)
    .then((res) => res.json())
    .then((res) => res.version as string | undefined)
}
