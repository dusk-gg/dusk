import js from "@eslint/js"
import prettier from "eslint-plugin-prettier/recommended"
import globals from "globals"
import runePlugin from "rune-sdk/eslint.js"

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
  },
  js.configs.recommended,
  ...runePlugin.configs.recommended,
  prettier,
  {
    rules: {
      "prettier/prettier": "warn",
    },
  },
]
