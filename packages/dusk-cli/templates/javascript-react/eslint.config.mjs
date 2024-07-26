import { fixupPluginRules } from "@eslint/compat"
import js from "@eslint/js"
import duskPlugin from "dusk-games-sdk/eslint.js"
import prettier from "eslint-plugin-prettier/recommended"
import pluginReact from "eslint-plugin-react"
import pluginReactHooks from "eslint-plugin-react-hooks"
import pluginReactRefresh from "eslint-plugin-react-refresh"
import globals from "globals"

export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2020,
      },
      ecmaVersion: "latest",
      sourceType: "module",
    },
    plugins: {
      "react-refresh": pluginReactRefresh,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  js.configs.recommended,
  ...duskPlugin.configs.recommended,
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat["jsx-runtime"],
  {
    plugins: {
      "react-hooks": fixupPluginRules(pluginReactHooks),
    },
    rules: pluginReactHooks.configs.recommended.rules,
  },
  {
    rules: {
      "react-refresh/only-export-components": "warn",
    },
  },
  prettier,
]
