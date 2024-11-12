import prettierConfig from "eslint-plugin-prettier/recommended"
import prettierPlugin from "eslint-plugin-prettier"
import globals from "globals"
import js from "@eslint/js"
import tseslint from "typescript-eslint"
import reactPlugin from "eslint-plugin-react"
import runePlugin from "eslint-plugin-rune"
import importPlugin from "eslint-plugin-import"
import react from "eslint-plugin-react"
import reactHooks from "eslint-plugin-react-hooks"
import nodePlugin from "eslint-plugin-n"
import pluginVue from "eslint-plugin-vue"

import fs from "fs"

async function getConfigs(dirName) {
  const entries = fs
    .readdirSync(dirName)
    //check if dir
    .filter((file) => fs.statSync(`${dirName}/${file}`).isDirectory())
    //has eslint.config.mjs
    .filter((file) => fs.existsSync(`${dirName}/${file}/eslint.config.mjs`))

  return (
    await Promise.all(
      entries.map(async (entry) => {
        const configs = await import(`./${dirName}/${entry}/eslint.config.mjs`)

        return configs.default.map((config) => ({
          files: [`${dirName}/${entry}/**`],
          ...config,
        }))
      })
    )
  ).flat()
}

export default [
  {
    ignores: [
      "**/dist",
      "**/build",
      "**/node_modules/",
      "**/generated/",
      "**/public/logic.js", //These are generated files
      "packages/rune/__temp/",
      "packages/rune/src/lib/jscodeshift/**/__testfixtures__",
      "packages/vite-plugin-rune/test/fixtures/",
      "packages/rune/cjs/",
      "**/.docusaurus",
      "docs/static/_examples",
      "docs/static/_tech-demos",
      "docs/src/theme",
    ],
  },
  js.configs.recommended,
  ...runePlugin.configs.recommended,
  //Only run it on ts files
  ...tseslint.configs.recommended.map((config) => ({
    files: ["**/*.tsx", "**/*.ts"],
    ...config,
  })),
  {
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },

      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        jsx: true,
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      "prettier/prettier": ["error"],
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  {
    files: [
      "packages/eslint-plugin-rune/**/*.spec.js",
      "packages/eslint-plugin-rune/test/createConfigTester.js",
    ],
    languageOptions: {
      globals: {
        ...globals.mocha,
      },
    },
  },
  {
    files: ["packages/eslint-plugin-rune/test/samples/*.js"],
    ...runePlugin.configs.logic,
  },
  {
    files: ["docs/**/*.js"],
    ...reactPlugin.configs.flat.recommended,
    languageOptions: {
      ...reactPlugin.configs.flat.recommended.languageOptions,
    },
  },

  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/ban-ts-comment": "off",
    },
  },

  {
    files: ["packages/rune/**"],
    plugins: {
      n: nodePlugin,

      import: importPlugin,
      react,
      "react-hooks": reactHooks,
    },
    rules: {
      "max-lines": ["warn", 2000],
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          caughtErrors: "none",
        },
      ],
      eqeqeq: ["error"],
      "no-extra-semi": ["off"],
      "n/no-unsupported-features/es-builtins": ["error"],
      "n/no-unsupported-features/es-syntax": ["off"],
      "n/no-unsupported-features/node-builtins": ["error"],
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "error",
      "no-else-return": [
        "error",
        {
          allowElseIf: false,
        },
      ],
      "object-shorthand": ["error", "properties"],
      curly: ["error", "multi-line", "consistent"],
      "arrow-body-style": ["error", "as-needed"],
      "no-lonely-if": "error",
      "no-unneeded-ternary": "error",
      "prefer-arrow-callback": "error",
      "prefer-const": [
        "error",
        {
          destructuring: "all",
        },
      ],
      "prefer-template": "error",
      "import/order": [
        "error",
        {
          groups: [
            ["builtin", "external"],
            "internal",
            "parent",
            ["sibling", "index"],
          ],
          "newlines-between": "always",

          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
      "no-duplicate-imports": [
        "error",
        {
          includeExports: true,
        },
      ],
      "no-console": "error",
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@apollo/client",
              message: "Please use @apollo/client/index.js instead",
            },
          ],
        },
      ],
    },
  },
  ...pluginVue.configs["flat/recommended"],
  {
    files: ["*.vue", "**/*.vue"],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },

  prettierConfig,

  ...(await getConfigs("examples")),
  ...(await getConfigs("tech-demos")),

  //Eslint only allows to define plugin once, and because each example game installs its own dependencies,
  //We need to point their plugins to root monorepo installs
].map((entry) => {
  if (entry.plugins?.rune) {
    entry.plugins.rune = runePlugin
  }

  if (entry.plugins?.prettier) {
    entry.plugins.prettier = prettierPlugin
  }

  if (entry.plugins?.["@typescript-eslint"]) {
    entry.plugins["@typescript-eslint"] = tseslint.plugin
  }

  return entry
})
