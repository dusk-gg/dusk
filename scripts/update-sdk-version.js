const fs = require("fs")
const path = require("path")
const child_process = require("child_process")

const version = process.argv[2]

const examplesDir = path.resolve(__dirname, "../examples")
const techDemosDir = path.resolve(__dirname, "../tech-demos")
const templatesDir = path.resolve(__dirname, "../packages/rune/templates")

const cliDir = path.resolve(__dirname, "../packages/rune")

//These example games also have sdk version inside html
const gamesWithHtml = {
  "oink-oink": "public/index.html",
  pinpoint: "public/index.html",
  sudoku: "public/index.html",
  "tic-tac-toe": "index.html",
}

if (version === undefined) {
  console.log("Please provide SDK version")
  process.exit(1)
}

const exampleGames = fs
  .readdirSync(examplesDir, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => ({
    name: dirent.name,
    dir: path.join(examplesDir, dirent.name),
    shouldInstall: true,
  }))

const templateGames = fs
  .readdirSync(templatesDir, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => ({
    name: dirent.name,
    dir: path.join(templatesDir, dirent.name),
    shouldInstall: false,
  }))

const techDemos = fs
  .readdirSync(techDemosDir, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => ({
    name: dirent.name,
    dir: path.join(techDemosDir, dirent.name),
    shouldInstall: true,
  }))

const cli = {
  name: "rune",
  dir: cliDir,
  shouldInstall: true,
}

const locations = [...exampleGames, ...templateGames, ...techDemos, cli]

locations.forEach(({ name, dir, shouldInstall }) => {
  if (!fs.existsSync(dir)) {
    throw new Error("Path not found!", dir)
  }

  const packageJsonPath = path.join(dir, "package.json")

  if (fs.existsSync(packageJsonPath)) {
    const packageJson = require(packageJsonPath)

    packageJson.dependencies["rune-sdk"] = `^${version}`

    console.log(`Updating ${path.relative(path.join(__dirname, ".."), dir)}`)

    console.log(` - Updating package.json`)
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))

    if (shouldInstall) {
      console.log(` - Updating yarn.lock (running yarn)`)
      child_process.execSync("yarn", { cwd: dir, stdio: "ignore" })
    }
  }

  if (gamesWithHtml[name]) {
    const indexHtmlPath = path.join(dir, gamesWithHtml[name])

    const indexHtml = fs.readFileSync(indexHtmlPath).toString()

    console.log(` - Updating index.html`)
    fs.writeFileSync(
      indexHtmlPath,
      indexHtml.replace(
        /<script src="https:\/\/cdn.jsdelivr.net\/npm\/rune-sdk@.+\/multiplayer-dev.js">/,
        `<script src="https://cdn.jsdelivr.net/npm/rune-sdk@${version}/multiplayer-dev.js">`
      )
    )
  }
})

console.log("Sdk version updated successfully")
