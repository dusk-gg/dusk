# vite-plugin-rune

Plugin to use Rune SDK with Vite. This plugin adds an SDK script line into your `index.html` file and creates a `logic.js` file to simplify your build setup. See [Syncing Game State](https://developers.rune.ai/docs/how-it-works/syncing-game-state) for more info on how Rune's SDK uses a `logic.js` file to seamlessly sync game state across players.

## Setup
If you're using the Rune quickstart template created using `npx rune-games-cli@latest create`, then this plugin is already set up for you. If not, then follow the steps below.
Update the `vite.config.ts`
```ts
// vite.config.ts
import { defineConfig } from "vite"
import rune from "rune-sdk/vite"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [rune({ logicPath: "./src/logic.ts" })],
})
```

## Which SDK version does this plugin use?

The Vite plugin uses the local SDK version that you've installed through npm/yarn. To update your SDK version, you just update it as normal.

## License

MIT © Rune AI Inc. 2024
