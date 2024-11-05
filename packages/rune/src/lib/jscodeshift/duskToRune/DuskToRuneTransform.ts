import type { FileInfo, API } from "jscodeshift"

export default function transform(
  file: FileInfo,
  api: API
): string | undefined {
  const j = api.jscodeshift

  const root = j(file.source)

  root.find(j.ImportDeclaration).forEach((path) => {
    // Find the import specifier for 'RuneClient'

    path.node.specifiers?.forEach((specifier) => {
      if ("imported" in specifier && specifier.imported.name === "DuskClient") {
        specifier.imported.name = "RuneClient"

        j(path).replaceWith(path.node)
      }
    })
  })

  root
    .find(j.ImportDeclaration)
    .filter(
      (path) =>
        path.node.source.value === "dusk-games-sdk" ||
        path.node.source.value === "dusk-games-sdk/multiplayer"
    )
    .forEach((path) => {
      path.node.source.value = "rune-sdk"

      j(path).replaceWith(path.node)
    })

  root.find(j.Identifier, { name: "DuskClient" }).forEach((path) => {
    path.node.name = "RuneClient"

    j(path).replaceWith(path.node)
  })

  root.find(j.Identifier, { name: "Dusk" }).forEach((path) => {
    path.node.name = "Rune"

    j(path).replaceWith(path.node)
  })

  return root.toSource()
}
