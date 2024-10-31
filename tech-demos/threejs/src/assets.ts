// Easy accessor for assets via name rather than static
// import. Makes it easier to manage assets
const ALL_ASSETS = import.meta.glob("./assets/**/*", {
  query: "?url",
  import: "default",
  eager: true,
}) as Record<string, string>

const ASSETS: Record<string, string> = {}

for (const key in ALL_ASSETS) {
  ASSETS[key.substring("./assets/".length)] = ALL_ASSETS[key]
}

export function getAssetUrl(ref: string) {
  if (!ASSETS[ref]) {
    console.log("ASSET NOT FOUND: ", ref)
  }
  return ASSETS[ref]
}
