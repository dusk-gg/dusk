export default function transformJSON(json: any) {
  ;["dependencies", "devDependencies", "peerDependencies"].forEach((dep) => {
    if (json[dep]) {
      if (json[dep]["dusk-games-sdk"]) {
        delete json[dep]["dusk-games-sdk"]
        json[dep]["rune-sdk"] = "^4.22.1"
      }
    }
  })

  json["scripts"]["upload"] = "npm run build && npx rune@latest upload"

  return json
}
