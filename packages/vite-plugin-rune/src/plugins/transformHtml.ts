import { readFileSync } from "node:fs"
import type { Plugin } from "vite"

export function getTransformHtmlForBuildPlugins(runePkgPath: string): Plugin[] {
  const runeVersion = JSON.parse(readFileSync(runePkgPath, "utf-8")).version

  return [
    {
      name: "vite:rune-plugin:inject-runtime",
      apply: "build",
      enforce: "post",
      transformIndexHtml(html) {
        return {
          //Remove the inlined logic file in case of build.
          //Vite puts the chunks as link preload tags in html, and we want them to be simple script tags.
          //Also remove client, so that logic & client scripts are next to each other
          html: html
            .replace(/<link.* href="(\.)*\/logic\.js">/, "")
            .replace(/<script.* src="(\.)*\/client\.js"><\/script>/, ""),
          tags: [
            // Inject the multiplayer script first of all.
            {
              tag: "script",
              attrs: {
                src: `https://cdn.jsdelivr.net/npm/rune-games-sdk@${runeVersion}/multiplayer.js`,
              },
              injectTo: "head-prepend",
            },
            //Actually insert the logic.js & client.js script tag.
            {
              tag: "script",
              attrs: {
                type: "module",
                crossorigin: true,
                src: "./logic.js",
              },
              injectTo: "head-prepend",
            },
            {
              tag: "script",
              attrs: {
                type: "module",
                crossorigin: true,
                src: "./client.js",
              },
              injectTo: "head-prepend",
            },
          ],
        }
      },
    },
  ]
}
