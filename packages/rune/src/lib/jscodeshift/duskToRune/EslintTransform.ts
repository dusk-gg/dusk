import type { FileInfo, API } from "jscodeshift"

export default function transform(file: FileInfo, api: API) {
  const j = api.jscodeshift

  const root = j(file.source)

  root
    .find(j.ImportDeclaration)
    .filter((path) => path.node.source.value === "dusk-games-sdk/eslint.js")
    .forEach((path) => {
      path.node.source.value = "rune-sdk/eslint.js"

      j(path).replaceWith(path.node)
    })

  root.find(j.Identifier, { name: "duskPlugin" }).forEach((path) => {
    path.node.name = "runePlugin"

    j(path).replaceWith(path.node)
  })

  return root.toSource()
}
