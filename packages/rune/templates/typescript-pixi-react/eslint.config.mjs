import js from "@eslint/js"
import prettier from "eslint-plugin-prettier/recommended"
import pluginReact from "eslint-plugin-react"
import pluginReactHooks from "eslint-plugin-react-hooks"
import globals from "globals"
import runePlugin from "rune-sdk/eslint.js"
import tseslint from "typescript-eslint"

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
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  js.configs.recommended,
  ...runePlugin.configs.recommended,
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat["jsx-runtime"],
  ...tseslint.configs.recommended,
  {
    plugins: {
      "react-hooks": pluginReactHooks,
    },
    rules: pluginReactHooks.configs.recommended.rules,
  },
  prettier,
  {
    rules: {
      "prettier/prettier": "warn",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
]
