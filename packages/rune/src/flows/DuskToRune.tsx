import { exec, spawn } from "child_process"
import { Box, Text } from "ink"
import { UncontrolledTextInput } from "ink-text-input"
import fs from "node:fs"
import { createRequire } from "node:module"
import path from "node:path"
import React, { useCallback, useEffect, useState } from "react"
import * as url from "url"

import { Step } from "../components/Step.js"
import transformJSON from "../lib/jscodeshift/duskToRune/PackageTransform.js"

enum Steps {
  Target,
  IncorrectDir,
  PackageJSON,
  Vite,
  Eslint,
  Source,
  Install,
  InstallError,
  Finish,
}

const pkgManager = process.env.npm_config_user_agent?.split("/")[0] || "npm"

const files: string[] = []

const getFilesRecursively = (directory: string) => {
  const filesInDirectory = fs.readdirSync(directory)

  for (const file of filesInDirectory) {
    if (file === "node_modules") {
      continue
    }

    const extension = file.split(".").at(-1)

    const absolute = path.join(directory, file)

    if (fs.statSync(absolute).isDirectory()) {
      getFilesRecursively(absolute)
    } else {
      if (
        extension !== "js" &&
        extension !== "ts" &&
        extension !== "jsx" &&
        extension !== "tsx"
      ) {
        continue
      }

      files.push(absolute)
    }
  }
}

function formatTargetDir(targetDir: string) {
  return targetDir.trim().replace(/\/+$/g, "")
}

const PLACEHOLDER = process.cwd()

const require = createRequire(import.meta.url)

export function DuskToRune({ args }: { args: string[] }) {
  const [step, setStep] = useState(Steps.Target)
  const [enteredTargetDir, setTargetDir] = useState(PLACEHOLDER)

  const onSubmitTarget = useCallback(async (value: string) => {
    setStep(Steps.PackageJSON)
    const targetDir = formatTargetDir(value || PLACEHOLDER)
    setTargetDir(targetDir)

    const packageJsonPath = path.join(targetDir, "package.json")

    if (!fs.existsSync(packageJsonPath)) {
      setStep(Steps.IncorrectDir)
    }

    const packageJson = transformJSON(require(packageJsonPath))

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))

    const __dirname = url.fileURLToPath(new URL(".", import.meta.url))

    async function transform(
      stepToUse: Steps,
      transformName: string,
      targets: string[]
    ) {
      setStep(stepToUse)

      const transformPath = path.resolve(
        __dirname,
        `../../cjs/lib/jscodeshift/duskToRune/${transformName}.js`
      )

      const process = exec(
        `npx jscodeshift --parser=tsx -t ${transformPath} ${targets.join(" ")}`
      )

      const promise = new Promise<void>((resolve) => {
        process.on("close", () => {
          resolve()
        })
      })

      await promise
    }

    await transform(Steps.Vite, "ViteTransform", [
      path.join(targetDir, "vite.config.ts"),
      path.join(targetDir, "vite.config.js"),
    ])

    await transform(Steps.Eslint, "EslintTransform", [
      path.join(targetDir, "eslint.config.mjs"),
      path.join(targetDir, "eslint.config.js"),
      path.join(targetDir, "eslint.config.ts"),
      path.join(targetDir, "eslint.config.mts"),
    ])

    getFilesRecursively(targetDir)

    await transform(Steps.Source, "DuskToRuneTransform", files)

    setStep(Steps.Install)

    const child = spawn(pkgManager, ["install"], {
      cwd: targetDir,
      //Fixes issue when running on windows https://stackoverflow.com/a/54515183
      shell: process.platform === "win32",
    })

    child.on("error", () => {
      setStep(Steps.InstallError)
    })

    child.on("close", (code) => {
      setStep(code === 0 ? Steps.Finish : Steps.InstallError)
    })
  }, [])

  useEffect(() => {
    if (args[0]) {
      onSubmitTarget(args[0])
    }
  }, [args, onSubmitTarget])

  return (
    <Box flexDirection="column">
      <Step
        status={
          step > Steps.IncorrectDir
            ? "success"
            : step === Steps.IncorrectDir
              ? "error"
              : "userInput"
        }
        label={"Game directory"}
        view={
          (step === Steps.Target && (
            <UncontrolledTextInput
              placeholder={PLACEHOLDER}
              onSubmit={onSubmitTarget}
            />
          )) || <Text>{enteredTargetDir}</Text>
        }
      />
      {step === Steps.IncorrectDir && (
        <Step
          status={"error"}
          label={"Incorrect game directory (package.json not found)"}
        />
      )}

      {step >= Steps.PackageJSON && (
        <Step
          status={step === Steps.PackageJSON ? "waiting" : "success"}
          label="package.json"
        />
      )}
      {step >= Steps.Vite && (
        <Step
          status={step === Steps.Vite ? "waiting" : "success"}
          label="vite config"
        />
      )}
      {step >= Steps.Eslint && (
        <Step
          status={step === Steps.Eslint ? "waiting" : "success"}
          label="eslint config"
        />
      )}
      {step >= Steps.Source && (
        <Step
          status={step === Steps.Source ? "waiting" : "success"}
          label="source code"
        />
      )}
      {step >= Steps.Install && (
        <Step
          status={
            step > Steps.InstallError
              ? "success"
              : step === Steps.InstallError
                ? "error"
                : "waiting"
          }
          label={
            step > Steps.InstallError
              ? `Dependencies installed successfully!`
              : step === Steps.InstallError
                ? `Failed to install dependencies`
                : `Installing dependencies...`
          }
        />
      )}
      {step === Steps.Finish && (
        <Step
          status={"success"}
          label={
            "Migration to Rune done. Try running yarn lint --fix in case file formatting is off."
          }
        />
      )}
    </Box>
  )
}
