import { ESLint, Linter } from "eslint"
import runePlugin from "eslint-plugin-rune"
import { parse, valid } from "node-html-parser"
import path from "path"
import semver from "semver"

import { FileInfo, findShortestPathFileThatEndsWith } from "./getGameFiles.js"

import LintMessage = Linter.LintMessage

export const MAX_PLAYERS = 6

export const validationOptions = {
  sdkUrlStartOldRune: "https://cdn.jsdelivr.net/npm/rune-games-sdk",
  sdkUrlStartRune: "https://cdn.jsdelivr.net/npm/rune-sdk",
  sdkUrlStartDusk: "https://cdn.jsdelivr.net/npm/dusk-games-sdk",
  sdkVersionRegex: /(?:rune|rune-games|dusk-games)-sdk@(\d+(\.\d+(\.\d+)?)?)/,
  minSdkVersion: "4.8.1",
  maxFiles: 1000,
  maxSizeMb: 10,
}

const eslint = new ESLint({
  overrideConfigFile: true,
  allowInlineConfig: false,
  baseConfig: [
    {
      languageOptions: {
        sourceType: "module",
      },
    },
    //@ts-expect-error - For some reason types not working here
    runePlugin.configs.logic,
  ],
})

export interface ValidationError {
  message: string
  lintErrors?: LintMessage[]
}

export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
  sdk: "Rune" | "Dusk"
}

export function parseGameIndexHtml(indexHtmlContent: string) {
  if (!valid(indexHtmlContent)) return null

  const { sdkUrlStartRune, sdkUrlStartOldRune, sdkUrlStartDusk } =
    validationOptions

  const parsedIndexHtml = parse(indexHtmlContent)
  const scripts = parsedIndexHtml.getElementsByTagName("script")
  const sdkScript = scripts.find(
    (script) =>
      script.getAttribute("src")?.startsWith(sdkUrlStartDusk) ||
      script.getAttribute("src")?.startsWith(sdkUrlStartRune) ||
      script.getAttribute("src")?.startsWith(sdkUrlStartOldRune)
  )

  return { parsedIndexHtml, scripts, sdkScript }
}

export type GameConfig = {
  landscape: boolean
  minPlayers: number | undefined
  maxPlayers: number | undefined
  updatesPerSecond: number
  eventCallbacks: {
    playerLeft: boolean
    playerJoined: boolean
  }
  update: boolean
  persistPlayerData: boolean
}

export async function validateGameFilesWithEval(
  logicRunner: string,
  files: FileInfo[]
) {
  const logicJs = findShortestPathFileThatEndsWith(files, "logic.js")

  //Remove export { ... } from logic.js
  const logicWithoutExports = logicJs?.content?.replace(/export {[^}]*}/gm, "")

  const gameConfig = logicJs
    ? eval(
        `
          //Prevent Math precision from being modified
          globalThis.Math.__SDK_PRECISION_SET__ = true
          ${logicRunner}
          ${logicWithoutExports}
          
          const bindings = globalThis.RUNE_FUNCTION_PREFIX_getLogicRunnerBindings()
          
          if (!bindings) {
            const invalidConfig = {}
            
            invalidConfig
          } else {
            bindings.getConfig()
          }
          
        `
      )
    : {}

  return validateGameFiles(files, gameConfig)
}

export async function validateGameFiles(
  files: FileInfo[],
  gameConfig: GameConfig
): Promise<ValidationResult> {
  const { sdkVersionRegex, minSdkVersion, maxFiles, maxSizeMb } =
    validationOptions

  const errors: ValidationError[] = []

  let sdkName = "Rune" as "Rune" | "Dusk"

  if (files.length > maxFiles) {
    errors.push({ message: `Too many files (>${maxFiles})` })
  }

  const totalSize = files.reduce((acc, file) => acc + file.size, 0)

  if (totalSize > maxSizeMb * 1e6) {
    errors.push({ message: `Game size must be less than ${maxSizeMb}MB` })
  }

  const indexHtml = findShortestPathFileThatEndsWith(files, "index.html")
  const logicJs = findShortestPathFileThatEndsWith(files, "logic.js")

  if (logicJs && logicJs.size > 1e6) {
    errors.push({ message: `logic.js size can't be more than 1MB` })
  }

  if (!indexHtml) {
    errors.push({ message: "Game must include index.html" })
  } else if (!indexHtml.content) {
    errors.push({
      message: "index.html content has not been provided for validation",
    })
  } else {
    const gameIndexHtmlElements = parseGameIndexHtml(indexHtml.content)

    if (!gameIndexHtmlElements) {
      errors.push({ message: "index.html is not valid HTML" })
    } else if (!gameIndexHtmlElements.sdkScript) {
      errors.push({
        message: `Game index.html must include ${sdkName} SDK script`,
      })
    } else {
      const { sdkScript, scripts } = gameIndexHtmlElements

      const { sdkUrlStartDusk, sdkUrlStartRune, sdkUrlStartOldRune } =
        validationOptions

      sdkName = scripts.some((script) =>
        script.getAttribute("src")?.startsWith(sdkUrlStartDusk)
      )
        ? ("Dusk" as const)
        : ("Rune" as const)

      if (
        scripts.filter(
          (script) =>
            script.getAttribute("src")?.startsWith(sdkUrlStartRune) ||
            script.getAttribute("src")?.startsWith(sdkUrlStartOldRune) ||
            script.getAttribute("src")?.startsWith(sdkUrlStartDusk)
        ).length > 1
      ) {
        errors.push({
          message: `${sdkName} SDK is imported 2+ times in index.html. If using the ${sdkName} Vite plugin, then remove your SDK import in index.html.`,
        })
      }

      if (
        sdkScript.getAttribute("src")?.endsWith("/multiplayer.js") ||
        sdkScript.getAttribute("src")?.endsWith("/multiplayer-dev.js")
      ) {
        await validateMultiplayer({
          errors,
          gameConfig,
          logicJs,
          indexHtml,
        })

        if (scripts.indexOf(sdkScript) !== 0) {
          errors.push({
            message: `${sdkName} SDK must be the first script in index.html`,
          })
        }

        const sdkVersion = sdkScript
          .getAttribute("src")
          ?.match(sdkVersionRegex)?.[1]

        if (!sdkVersion) {
          errors.push({ message: `${sdkName} SDK must specify a version` })
        }

        const [major, minor, patch] = (sdkVersion ?? "").split(".")
        const maxedOutSdkVersion = `${major}.${minor ?? 999}.${patch ?? 999}`

        const sdkVersionCoerced = semver.coerce(
          sdkVersion && maxedOutSdkVersion
        )
        const minSdkVersionCoerced = semver.coerce(minSdkVersion)

        if (
          sdkVersionCoerced &&
          minSdkVersionCoerced &&
          semver.lt(sdkVersionCoerced, minSdkVersionCoerced)
        ) {
          errors.push({
            message: `${sdkName} SDK is below minimum version (included ${sdkVersion}, min ${minSdkVersion})`,
          })
        }
      } else {
        errors.push({
          message: `${sdkName} SDK script url must end with /multiplayer.js or /multiplayer-dev.js`,
        })
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    sdk: sdkName,
  }
}

async function validateMultiplayer({
  errors,
  gameConfig,
  logicJs,
  indexHtml,
}: {
  errors: ValidationError[]
  gameConfig: GameConfig
  logicJs: FileInfo | undefined
  indexHtml: FileInfo
}): Promise<void> {
  if (!logicJs) {
    errors.push({
      message: "logic.js must be included in the game files",
    })
  } else {
    if (path.dirname(indexHtml.path) !== path.dirname(logicJs.path)) {
      errors.push({
        message: "logic.js must be in the same directory as index.html",
      })
    }

    return validateMultiplayerLogicJsContent({
      logicJs,
      gameConfig,
      errors,
    })
  }
}

async function validateMultiplayerLogicJsContent({
  logicJs,
  gameConfig,
  errors,
}: {
  logicJs: FileInfo
  gameConfig: GameConfig
  errors: ValidationError[]
}): Promise<void> {
  if (!logicJs.content) {
    errors.push({
      message: "logic.js content has not been provided for validation",
    })
  } else {
    await eslint
      .lintText(logicJs.content)
      .then((results) => {
        const result = results.at(0)

        if (result) {
          const lintErrors = result.messages.filter((err) => err.severity === 2)

          if (lintErrors.length > 0) {
            errors.push({
              message: "logic.js contains invalid code",
              lintErrors,
            })
          }
        } else {
          errors.push({ message: "failed to lint logic.js" })
        }
      })
      .catch(() => {
        errors.push({ message: "failed to lint logic.js" })
      })

    if (
      !gameConfig.minPlayers ||
      typeof gameConfig.minPlayers !== "number" ||
      isNaN(gameConfig.minPlayers)
    ) {
      errors.push({
        message: "logic.js: minPlayers not found or is invalid",
      })
    } else if (
      gameConfig.minPlayers &&
      (gameConfig.minPlayers < 1 || gameConfig.minPlayers > MAX_PLAYERS)
    ) {
      errors.push({
        message: `logic.js: minPlayers must be between 1 and ${MAX_PLAYERS}`,
      })
    }

    if (
      !gameConfig.maxPlayers ||
      typeof gameConfig.maxPlayers !== "number" ||
      isNaN(gameConfig.maxPlayers)
    ) {
      errors.push({
        message: "logic.js: maxPlayers not found or is invalid",
      })
    } else if (
      gameConfig.maxPlayers &&
      (gameConfig.maxPlayers < 1 || gameConfig.maxPlayers > MAX_PLAYERS)
    ) {
      errors.push({
        message: `logic.js: maxPlayers must be between 1 and ${MAX_PLAYERS}`,
      })
    }

    if (
      gameConfig.maxPlayers &&
      gameConfig.minPlayers &&
      gameConfig.maxPlayers < gameConfig.minPlayers
    ) {
      errors.push({
        message:
          "logic.js: maxPlayers must be greater than or equal to minPlayers",
      })
    }

    if (gameConfig.updatesPerSecond === undefined) {
      errors.push({
        message:
          "logic.js: updatesPerSecond must be a constant (updatesPerSecond: 1-30)",
      })
    } else if (
      gameConfig.updatesPerSecond < 1 ||
      gameConfig.updatesPerSecond > 30
    ) {
      errors.push({
        message:
          "logic.js: updatesPerSecond must be undefined or between 1 and 30",
      })
    }
  }
}
