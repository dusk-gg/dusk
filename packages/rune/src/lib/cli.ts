import meow from "meow"

export const cli = meow(
  `
  Usage
    $ rune create <[optional] project name, defaults to current directory>
    $ rune upload <[optional] game path, defaults to current directory>
    $ rune update-info    [Updating game info (title, description, logo)]
    $ rune list           [Lists all your games]
    $ rune update-members [Sets up team for your game]
    $ rune dusk-to-rune <[optional] path> [Migrates your game from Dusk to Rune]
    $ rune dash Opens the Rune dashboard

  Options
    --version, -v   Show CLI version 

  Optional Upload Options
    --release, -r   Mark the game version as ready for release
    --draft,   -d   Mark the game version as draft
    --name,    -n   <game name>  Name of the existing game.

  Examples
    $ rune create my-game

    $ cd my-game && rune upload

    $ rune upload ./my-game

    $ rune upload ./my-game --release --name "My Awesome Game"
    
`,
  {
    importMeta: import.meta,
    autoHelp: false,
    autoVersion: false,

    flags: {
      version: {
        type: "boolean",
        alias: "v",
      },
      release: {
        alias: "r",
        type: "boolean",
        default: false,
      },
      draft: {
        alias: "d",
        type: "boolean",
        default: false,
      },

      name: {
        type: "string",
        alias: "n",
      },
    },
  }
)

export const validCommands = [
  "help",
  "logout",
  "list",
  "upload",
  "update-info",
  "update-members",
  "create",
  "dashboard",
  "dash",
  "dusk-to-rune",
] as const

export function cliCommand() {
  const command = cli.input[0] as (typeof validCommands)[number] | undefined

  return {
    command,
    args: cli.input.slice(1),
    commandInvalid: command && !validCommands.includes(command),
    flags: cli.flags,
  }
}

export type CLI = typeof cli
export type CliFlags = CLI["flags"]
