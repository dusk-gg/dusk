import type { FileInfo, API } from "jscodeshift"

export default function transform(file: FileInfo, api: API) {
  const j = api.jscodeshift

  const root = j(file.source)

  root
    .find(j.ImportDeclaration)
    .filter((path) => path.node.source.value === "dusk-games-sdk/vite")
    .forEach((path) => {
      path.node.source.value = "rune-sdk/vite"

      j(path).replaceWith(path.node)
    })

  root.find(j.Identifier, { name: "dusk" }).forEach((path) => {
    path.node.name = "rune"

    j(path).replaceWith(path.node)
  })

  return root.toSource()
}
