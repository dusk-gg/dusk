import { describe, test, expect, jest } from "@jest/globals"
import { readFileSync } from "fs"
import { range } from "lodash"
import * as path from "path"

import { FileInfo } from "./getGameFiles"
import { MAX_PLAYERS, validateGameFilesWithEval } from "./validateGameFiles"

jest.mock("./rootPath.ts", () => ({
  rootPath: path.resolve(__dirname, "../.."),
}))

function validateGameFiles(files: FileInfo[]) {
  const logicRunnerPath = require.resolve("rune-sdk/dist/logicRunner")
  const logicRunner = readFileSync(logicRunnerPath).toString()

  return validateGameFilesWithEval(logicRunner, files)
}

describe("validateGameFiles", () => {
  test("should validate game content", async () => {
    await Promise.all(
      [
        ["Rune", "rune-sdk"],
        //These two are deprecated but still used by existing games
        ["Rune", "rune-games-sdk"],
        ["Dusk", "dusk-games-sdk"],
      ].map(async ([n, packageName]) => {
        const name = n as "Rune" | "Dusk"

        const validLogicFile = {
          path: "src/logic.js",
          size: 1 * 1e6,
          // language=JavaScript
          content: `
            ${name}.initLogic({
              minPlayers: 1,
              maxPlayers: 4,
              setup: () => {
                return {}
              },
              actions: {},
              events: {
                playerJoined: () => {},
                playerLeft () {},
              },
            })`,
        }

        await expect(
          validateGameFiles([
            { path: "media/background.png", size: 1 * 1e6 },
            {
              path: "src/logic.js",
              size: 1 * 1e6,
              // language=JavaScript
              content: `
            ${name}.initLogic({
              minPlayers: 1,
              maxPlayers: 4,
              setup: () => {
                return {}
              },
              actions: {},
              events: {
                playerJoined: () => {},
                playerLeft () {},
              },
            })
            
            const a = 1;
            const b = 2;
            const c = 3;
            
              export {
                a,
                b,
                c
              }
              `,
            },
            {
              path: "src/index.html",
              size: 1 * 1e6,
              content: `
              <!DOCTYPE html>
              <html lang="en">
                <head>
                  <title>Game</title>
                  <script src="https://cdn.jsdelivr.net/npm/${packageName}@4/dist/multiplayer.js"></script>
                  <script src="src/logic.js"></script>
                </head>
                <body></body>
              </html>`,
            },
          ])
        ).resolves.toEqual({
          valid: true,
          errors: [],
          sdk: name,
        })

        await expect(
          validateGameFiles([
            { path: "media/background.png", size: 1 * 1e6 },
            validLogicFile,
            {
              path: "src/index.html",
              size: 1 * 1e6,
              content: `
              <!DOCTYPE html>
              <html lang="en">
                <head>
                  <title>Game</title>
                  <script src="https://cdn.jsdelivr.net/npm/${packageName}@4.8.1/dist/multiplayer.js"></script>
                  <script src="src/logic.js"></script>
                </head>
                <body></body>
              </html>`,
            },
          ])
        ).resolves.toEqual({
          valid: true,
          errors: [],
          sdk: name,
        })

        await expect(
          validateGameFiles([
            { path: "media/background.png", size: 1 * 1e6 },
            validLogicFile,
            {
              path: "src/index.html",
              size: 1 * 1e6,
              content: `
              <!DOCTYPE html>
              <html lang="en">
                <head>
                  <title>Game</title>
                  <script src="https://cdn.jsdelivr.net/npm/${packageName}@4.8.1/dist/singleplayer.js"></script>
                  <script src="src/logic.js"></script>
                </head>
                <body></body>
              </html>`,
            },
          ])
        ).resolves.toEqual({
          valid: false,
          errors: [
            {
              message: `${name} SDK script url must end with /multiplayer.js or /multiplayer-dev.js`,
            },
          ],
          sdk: name,
        })

        await expect(
          validateGameFiles([
            { path: "media/background.png", size: 1 * 1e6 },
            validLogicFile,
            {
              path: "src/index.html",
              size: 1 * 1e6,
              content: `
              <!DOCTYPE html>
              <html lang="en">
                <head>
                  <title>Game</title>
                  <script src="https://cdn.jsdelivr.net/npm/${packageName}@4.4.5/dist/multiplayer.js"></script>
                  <script src="src/logic.js"></script>
                </head>
                <body></body>
              </html>`,
            },
          ])
        ).resolves.toEqual({
          valid: false,
          errors: [
            {
              message: `${name} SDK is below minimum version (included 4.4.5, min 4.8.1)`,
            },
          ],
          sdk: name,
        })

        await expect(
          validateGameFiles([
            { path: "media/background.png", size: 1 * 1e6 },
            validLogicFile,
            {
              path: "src/index.html",
              size: 1 * 1e6,
              content: `
              <!DOCTYPE html>
              <html lang="en">
                <head>
                  <title>Game</title>
                  <script src="https://cdn.jsdelivr.net/npm/${packageName}@4.4/dist/multiplayer.js"></script>
                  <script src="src/logic.js"></script>
                </head>
                <body></body>
              </html>`,
            },
          ])
        ).resolves.toEqual({
          valid: false,
          errors: [
            {
              message: `${name} SDK is below minimum version (included 4.4, min 4.8.1)`,
            },
          ],
          sdk: name,
        })

        await expect(
          validateGameFiles([
            { path: "media/background.png", size: 1 * 1e6 },
            validLogicFile,
            {
              path: "src/index.html",
              size: 1 * 1e6,
              content: `
              <!DOCTYPE html>
              <html lang="en">
                <head>
                  <title>Game</title>
                  <script src="https://cdn.jsdelivr.net/npm/${packageName}@3/dist/multiplayer.js"></script>
                  <script src="src/logic.js"></script>
                </head>
                <body></body>
              </html>`,
            },
          ])
        ).resolves.toEqual({
          valid: false,
          errors: [
            {
              message: `${name} SDK is below minimum version (included 3, min 4.8.1)`,
            },
          ],
          sdk: name,
        })

        await expect(
          validateGameFiles([
            { path: "media/background.png", size: 1 * 1e6 },
            validLogicFile,
            {
              path: "src/index.html",
              size: 1 * 1e6,
              content: `
              <!DOCTYPE html>
              <html lang="en">
                <head>
                  <title>Game</title>
                  <script src="https://cdn.jsdelivr.net/npm/${packageName}@4/dist/multiplayer.js"></script>
                  <script src="src/logic.js"></script>
                </head>
                <body></body>
              </html>`,
            },
          ])
        ).resolves.toEqual({
          valid: true,
          errors: [],
          sdk: name,
        })

        await expect(
          validateGameFiles([
            { path: "media/background.png", size: 1 * 1e6 },
            validLogicFile,
            {
              path: "src/nestedFolder/index.html",
              size: 1 * 1e6,
              content: `
              <!DOCTYPE html>
              <html lang="en">
                INVALID CONTENT
              </html>`,
            },
            {
              path: "src/index.html",
              size: 1 * 1e6,
              content: `
              <!DOCTYPE html>
              <html lang="en">
                <head>
                  <title>Game</title>
                  <script src="https://cdn.jsdelivr.net/npm/${packageName}@4/dist/multiplayer.js"></script>
                  <script src="src/logic.js"></script>
                </head>
                <body></body>
              </html>`,
            },
          ])
        ).resolves.toEqual({
          // valid because we should only look at the root index.html
          valid: true,
          errors: [],
          sdk: name,
        })

        await expect(
          validateGameFiles([
            { path: "media/background.png", size: 1 * 1e6 },
            validLogicFile,
            {
              path: "src/index.html",
              size: 1 * 1e6,
              content: `
              <!DOCTYPE html>
              <html lang="en">
                <head>
                  <title>Game</title>
                  <script src="https://cdn.jsdelivr.net/npm/${packageName}/dist/multiplayer.js"></script>
                  <script src="src/logic.js"></script>
                </head>
                <body></body>
              </html>`,
            },
          ])
        ).resolves.toEqual({
          valid: false,
          errors: [{ message: `${name} SDK must specify a version` }],
          sdk: name,
        })

        await expect(
          validateGameFiles([
            { path: "media/background.png", size: 30 * 1e6 },
            validLogicFile,
            {
              path: "src/index.html",
              size: 10 * 1e6,
              content: `
              <!DOCTYPE html>
              <html lang="en">
                <head>
                  <title>Game</title>
                  <script src="src/logic.js"></script>
                  <script src="https://cdn.jsdelivr.net/npm/${packageName}@4.8.1/dist/multiplayer.js"></script>
                </head>
                <body></body>
              </html>`,
            },
          ])
        ).resolves.toEqual({
          valid: false,
          errors: [
            { message: "Game size must be less than 25MB" },
            { message: `${name} SDK must be the first script in index.html` },
          ],
          sdk: name,
        })

        await expect(
          validateGameFiles([
            { path: "media/background.png", size: 1 * 1e6 },
            validLogicFile,
            {
              path: "src/index.html",
              size: 1 * 1e6,
              content: `
              <!DOCTYPE html>
              <html lang="en">
                <head>
                  <title>Game</title>
                  <script src="src/logic.js"></script>
                </head>
                <body></body>
              </html>`,
            },
          ])
        ).resolves.toEqual({
          valid: false,
          errors: [{ message: `Game index.html must include Rune SDK script` }],
          sdk: "Rune",
        })

        await expect(
          validateGameFiles([
            { path: "media/background.png", size: 1 * 1e6 },
            validLogicFile,
            { path: "src/index.html", size: 1 * 1e6 },
          ])
        ).resolves.toEqual({
          valid: false,
          errors: [
            {
              message:
                "index.html content has not been provided for validation",
            },
          ],
          sdk: "Rune",
        })

        await expect(
          validateGameFiles([
            { path: "media/background.png", size: 1 * 1e6 },
            validLogicFile,
          ])
        ).resolves.toEqual({
          valid: false,
          errors: [{ message: "Game must include index.html" }],
          sdk: "Rune",
        })

        await expect(
          validateGameFiles(
            range(0, 1001).map(() => ({ path: "path/to/file.png", size: 1 }))
          )
        ).resolves.toEqual({
          valid: false,
          errors: [
            { message: "Too many files (>1000)" },
            { message: "Game must include index.html" },
          ],
          sdk: "Rune",
        })

        await expect(
          validateGameFiles([
            {
              path: "src/index.html",
              size: 1 * 1e6,
              content: `
              <!DOCTYPE html>
              <html lang="en">
                <head>
                  <title>Game</title>
                </head>
                <body>
                  <script src="src/logic.js">
                  <div>
                </body>
              </html>`,
            },
          ])
        ).resolves.toEqual({
          valid: false,
          errors: [{ message: "index.html is not valid HTML" }],
          sdk: "Rune",
        })

        await expect(
          validateGameFiles([
            {
              path: "index.html",
              size: 1 * 1e6,
              content: `
              <html>
                <script src="logic.js"></script>
                <script src="https://cdn.jsdelivr.net/npm/${packageName}@4.8.1/dist/multiplayer.js"></script>
              </html>`,
            },
          ])
        ).resolves.toEqual({
          valid: false,
          errors: [
            { message: "logic.js must be included in the game files" },
            { message: `${name} SDK must be the first script in index.html` },
          ],
          sdk: name,
        })

        await expect(
          validateGameFiles([
            {
              path: "index.html",
              size: 1 * 1e6,
              content: `
              <html>
                <script src="https://cdn.jsdelivr.net/npm/${packageName}@4.8.1/dist/multiplayer.js"></script>
                <script src="logic.js"></script>
              </html>`,
            },
            {
              path: "logic.js",
              size: 1 * 1e6,
            },
          ])
        ).resolves.toEqual({
          valid: false,
          errors: [
            {
              message: "logic.js content has not been provided for validation",
            },
          ],
          sdk: name,
        })

        await expect(
          validateGameFiles([
            {
              path: "index.html",
              size: 1 * 1e6,
              content: `
              <html>
                <!-- multiplayer-dev.js is also detected as multiplayer -->
                <script src="https://cdn.jsdelivr.net/npm/${packageName}@4.8.1/dist/multiplayer-dev.js"></script>
                <script src="logic.js"></script>
              </html>`,
            },
            {
              path: "logic.js",
              size: 1 * 1e6,
              // language=JavaScript
              content: `
            ${name}.initLogic({
              minPlayers: "33",
              setup: () => {
                return { cells: Array(25).fill(null) }
              },
              actions: {},
              events: {
                playerJoined: () => {},
                playerLeft () {} ,
              },
            })`,
            },
          ])
        ).resolves.toEqual({
          valid: false,
          errors: [
            { message: "logic.js: minPlayers not found or is invalid" },
            { message: "logic.js: maxPlayers not found or is invalid" },
          ],
          sdk: name,
        })

        await expect(
          validateGameFiles([
            {
              path: "index.html",
              size: 1 * 1e6,
              content: `
              <html>
                <script src="https://cdn.jsdelivr.net/npm/${packageName}@4.8.1/dist/multiplayer.js"></script>
                <script src="logic.js"></script>
              </html>`,
            },
            {
              path: "logic.js",
              size: 1 * 1e6,
              // language=JavaScript
              content: `
              ${name}.initLogic({
                minPlayers: 8,
                maxPlayers: 7,
                setup: () => {
                  return { cells: Array(25).fill(null) }
                },
                actions: {},
                events: {
                  playerJoined: () => {},
                  playerLeft () {},
                },
              })`,
            },
          ])
        ).resolves.toEqual({
          valid: false,
          errors: [
            {
              message: `logic.js: minPlayers must be between 1 and ${MAX_PLAYERS}`,
            },
            {
              message: `logic.js: maxPlayers must be between 1 and ${MAX_PLAYERS}`,
            },
            {
              message:
                "logic.js: maxPlayers must be greater than or equal to minPlayers",
            },
          ],
          sdk: name,
        })

        await expect(
          validateGameFiles([
            {
              path: "index.html",
              size: 1 * 1e6,
              content: `
              <html>
                <script src="https://cdn.jsdelivr.net/npm/${packageName}@4.8.1/dist/multiplayer.js"></script>
                <script src="logic.js"></script>
              </html>`,
            },
            {
              path: "logic.js",
              size: 1 * 1e6,
              // language=JavaScript
              content: `
              ${name}.initLogic({
                minPlayers: 2,
                maxPlayers: 4,
                setup: () => {
                  setTimeout(() => {}, 1000)
                  return { cells: Array(25).fill(null) }
                },
                actions: {},
                events: {
                  playerJoined: () => {},
                  playerLeft () {},
                },
              })`,
            },
          ])
        ).resolves.toEqual({
          valid: false,
          errors: [
            {
              message: "logic.js contains invalid code",
              lintErrors: [
                {
                  column: 19,
                  endColumn: 29,
                  endLine: 6,
                  line: 6,
                  message: "Unexpected use of 'setTimeout'.",
                  messageId: "defaultMessage",
                  nodeType: "Identifier",
                  ruleId: "no-restricted-globals",
                  severity: 2,
                },
                {
                  column: 19,
                  endColumn: 29,
                  endLine: 6,
                  line: 6,
                  message: "'setTimeout' is not defined.",
                  messageId: "undef",
                  nodeType: "Identifier",
                  ruleId: "no-undef",
                  severity: 2,
                },
              ],
            },
          ],
          sdk: name,
        })

        await expect(
          validateGameFiles([
            {
              path: "index.html",
              size: 1 * 1e6,
              content: `
              <html>
                <script src="https://cdn.jsdelivr.net/npm/${packageName}@4.8.1/dist/multiplayer.js"></script>
                <script src="logic.js"></script>
              </html>`,
            },
            {
              path: "logic.js",
              size: 1 * 1e6,
              // language=JavaScript
              content: `
              ${name}.initLogic({
                minPlayers: 2,
                maxPlayers: 4,
                setup: () => {
                  console.log("console is allowed")
                  return { cells: Array(25).fill(null) }
                },
                actions: {},
                events: {
                  playerJoined: () => {},
                  playerLeft () {},
                },
              })`,
            },
          ])
        ).resolves.toEqual({
          valid: true,
          errors: [],
          sdk: name,
        })

        await expect(
          validateGameFiles([
            {
              path: "index.html",
              size: 1 * 1e6,
              content: `
              <html>
                <script src="https://cdn.jsdelivr.net/npm/${packageName}@4.8.1/dist/multiplayer.js"></script>
                <script src="src/logic.js"></script>
              </html>`,
            },
            {
              path: "src/logic.js",
              size: 1 * 1e6,
              content: "",
            },
          ])
        ).resolves.toEqual({
          valid: false,
          errors: [
            {
              message: "logic.js must be in the same directory as index.html",
            },
            {
              message: "logic.js content has not been provided for validation",
            },
          ],
          sdk: name,
        })

        await expect(
          validateGameFiles([
            {
              path: "index.html",
              size: 1 * 1e6,
              content: `
              <html>
                <script src="https://cdn.jsdelivr.net/npm/${packageName}@4.8.1/dist/multiplayer.js"></script>
                <script type="module" src="client.js"></script>
              </html>`,
            },
            {
              path: "logic.js",
              size: 1 * 1e6,
              // language=JavaScript
              content: `
              ${name}.initLogic({
                minPlayers: 2,
                maxPlayers: 4,
                setup: () => {
                  return { cells: Array(25).fill(null) }
                },
                actions: {},
                events: {
                  playerJoined: () => {},
                  playerLeft () {},
                },
              })`,
            },
            {
              path: "client.js",
              size: 1 * 1e6,
              content: "import 'logic.js';",
            },
          ])
        ).resolves.toEqual({
          valid: true,
          errors: [],
          sdk: name,
        })

        await expect(
          validateGameFiles([
            {
              path: "index.html",
              size: 1 * 1e6,
              content: `
              <html>
                <script src="https://cdn.jsdelivr.net/npm/${packageName}@4.8.1/dist/multiplayer.js"></script>
                <script src="logic.js"></script>
              </html>`,
            },
            {
              path: "logic.js",
              size: 1 * 1e6,
              // language=JavaScript
              content: `
              ${name}.initLogic({
                minPlayers: 1,
                maxPlayers: 4,
                updatesPerSecond: 40,
                inputDelay: 50,
                setup: () => {
                  return { cells: Array(25).fill(null) }
                },
                actions: {},
                events: {
                  playerJoined: () => {},
                  playerLeft () {},
                },
              })`,
            },
          ])
        ).resolves.toEqual({
          valid: false,
          errors: [
            {
              message:
                "logic.js: updatesPerSecond must be undefined or between 1 and 30",
            },
          ],
          sdk: name,
        })

        await expect(
          validateGameFiles([
            {
              path: "index.html",
              size: 1 * 1e6,
              content: `
              <html>
                <script src="https://cdn.jsdelivr.net/npm/${packageName}@4.8.1/dist/multiplayer.js"></script>
                <script src="logic.js"></script>
              </html>`,
            },
            {
              path: "logic.js",
              size: 1 * 1e6,
              // language=JavaScript
              content: `
              ${name}.initLogic({
                minPlayers: 1,
                maxPlayers: 4,
                updatesPerSecond: 10,
                landscape: true,
                persistPlayerData: true,
                setup: () => {
                  return { cells: Array(25).fill(null) }
                },
                actions: {},
                events: {
                  playerJoined: () => {},
                  playerLeft () {},
                },
              })`,
            },
          ])
        ).resolves.toEqual({
          valid: true,
          errors: [],
          sdk: name,
        })

        await expect(
          validateGameFiles([
            {
              path: "index.html",
              size: 1 * 1e6,
              content: `
              <html>
                <!-- multiplayer-dev.js is also detected as multiplayer -->
                <script src="https://cdn.jsdelivr.net/npm/${packageName}@4.8.1/dist/multiplayer-dev.js"></script>
                <script src="logic.js"></script>
              </html>`,
            },
            {
              path: "logic.js",
              size: 1 * 1e6 + 1,
              // language=JavaScript
              content: `
            ${name}.initLogic({
              minPlayers: 1,
              maxPlayers: 4,
              setup: () => {
                return { cells: Array(25).fill(null) }
              },
              actions: {},
              events: {
                playerJoined: () => {},
                playerLeft () {} ,
              },
            })`,
            },
          ])
        ).resolves.toEqual({
          valid: false,
          errors: [
            {
              message: "logic.js size can't be more than 1MB",
            },
          ],
          sdk: name,
        })

        await expect(
          validateGameFiles([
            { path: "media/background.png", size: 1 * 1e6 },
            validLogicFile,
            {
              path: "src/index.html",
              size: 1 * 1e6,
              content: `
              <!DOCTYPE html>
              <html lang="en">
                <head>
                  <title>Game</title>
                  <script src="https://cdn.jsdelivr.net/npm/${packageName}@4.8.1/dist/multiplayer.js"></script>
                  <script src="https://cdn.jsdelivr.net/npm/${packageName}@4/dist/multiplayer-dev.js"></script>
                  <script src="src/logic.js"></script>
                </head>
                <body></body>
              </html>`,
            },
          ])
        ).resolves.toEqual({
          valid: false,
          errors: [
            {
              message: `${name} SDK is imported 2+ times in index.html. If using the ${name} Vite plugin, then remove your SDK import in index.html.`,
            },
          ],
          sdk: name,
        })
      })
    )
  })
})
