import js from "@eslint/js"
import prettier from "eslint-plugin-prettier/recommended"
import globals from "globals"
import runePlugin from "rune-sdk/eslint.js"
import svelteParser from "svelte-eslint-parser"
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
  },
  js.configs.recommended,
  ...runePlugin.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
        extraFileExtensions: [".svelte"],
      },
    },
  },
  {
    files: ["*.svelte"],
    languageOptions: {
      parser: svelteParser,
      // Parse the `<script>` in `.svelte` as TypeScript by adding the following configuration.
      parserOptions: {
        parser: tseslint.parser,
      },
    },
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
