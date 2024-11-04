import { Linter } from "eslint"
import * as globals from "globals"

import { rules } from "./rules/index.js"

const restrictedSyntaxBase = [
  {
    selector: "TryStatement",
    message: "Try/catch might prevent Rune from working properly.",
  },
  {
    selector: "ThisExpression,WithStatement",
    message: "This references might prevent Rune from working properly.",
  },
  {
    selector:
      "AwaitExpression,ArrowFunctionExpression[async=true],FunctionExpression[async=true],FunctionDeclaration[async=true],YieldExpression",
    message: "Rune logic must be synchronous.",
  },
  {
    selector: "RegExpLiteral",
    message:
      "Regular expressions are stateful and might prevent Rune from working properly.",
  },
  {
    selector: "NewExpression[callee.name='Date'][arguments.length!=1]",
    message:
      "Use Rune.gameTime()/Rune.worldTime(). Date is only used as helper for date manipulation and providing initial value is mandatory. See https://developers.rune.ai/docs/advanced/real-time-games for more info.",
  },
  {
    selector: "CallExpression[callee.name='Date'][arguments.length!=1]",
    message:
      "Use Rune.gameTime()/Rune.worldTime(). Date is only used as helper for date manipulation and providing initial value is mandatory. See https://developers.rune.ai/docs/advanced/real-time-games for more info.",
  },
  {
    selector: "MemberExpression[object.name='Date'][property.name='now']",
    message:
      "Use Rune.gameTime()/Rune.worldTime(). Date is only used as helper for date manipulation and providing initial value is mandatory. See https://developers.rune.ai/docs/advanced/real-time-games for more info.",
  },
]

const restrictedGlobals = [
  "exports",
  "module",
  "require",
  "window",
  "global",
  "constructor",
  "decodeURI",
  "decodeURIComponent",
  "encodeURI",
  "encodeURIComponent",
  "escape",
  "eval",
  "EvalError",
  "Function",
  "RegExp",
  "toLocaleString",
  "unescape",
  "ArrayBuffer",
  "DataView",
  "Float32Array",
  "Float64Array",
  "Int16Array",
  "Int32Array",
  "Int8Array",
  "Promise",
  "Proxy",
  "Reflect",
  "Symbol",
  "Uint16Array",
  "Uint32Array",
  "Uint8Array",
  "Uint8ClampedArray",
  "WeakMap",
  "WeakSet",
  "Atomics",
  "SharedArrayBuffer",
  "BigInt",
  "BigInt64Array",
  "BigUint64Array",
  "FinalizationRegistry",
  "WeakRef",
  "Performance",
  "Intl",
  "setTimeout",
  "clearTimeout",
  "setInterval",
  "clearInterval",
  "alert",
  "fetch",
  "performance",
  "XMLHttpRequest",
]

const plugin = {
  meta: {
    name: "eslint-plugin-rune",
    version: "2.1.0",
  },
  configs: {
    recommended: {},
    logic: {},
    logicModule: {},
  },
  rules,
}

// Each validated file yb logicConfig is treated as logic file
const logicConfig: Linter.Config = {
  plugins: {
    rune: plugin,
  },
  rules: {
    "no-restricted-globals": ["error", ...restrictedGlobals],
    "no-undef": 2,
    "no-global-assign": 2,
    "no-extend-native": 2,
    "no-var": 1,
    "no-restricted-properties": [
      2,
      {
        object: "Rune",
        property: "init",
        message: "Rune.init() is restricted to client-only code.",
      },
      {
        object: "Rune",
        property: "initClient",
        message: "Rune.init() is restricted to client-only code.",
      },
      {
        object: "Rune",
        property: "deterministicRandom",
        message: "Rune.init() is restricted to client-only code.",
      },
      {
        property: "toLocaleString",
        message: "Locale specific operations are not allowed",
      },
      {
        property: "toLocaleLowerCase",
        message: "Locale specific operations are not allowed",
      },
      {
        property: "toLocaleUpperCase",
        message: "Locale specific operations are not allowed",
      },
      {
        property: "localeCompare",
        message: "Locale specific operations are not allowed",
      },
      {
        property: "then",
        message: "Promises in logic are not allowed.",
      },
    ],
    "no-restricted-syntax": [
      "error",
      {
        selector:
          "ImportDeclaration,ExportNamedDeclaration[source],ExportAllDeclaration[source],ExportDefaultDeclaration[source]",
        message: "Rune logic must be contained in a single file.",
      },
      ...restrictedSyntaxBase,
    ],
    "rune/no-global-scope-mutation": 2,
  },
  languageOptions: {
    ecmaVersion: 2021,
    globals: {
      ...globals.es2016,
      globalThis: "readonly",
      global: "readonly",
      Dusk: "readonly",
      Rune: "readonly",
      console: "readonly",
    },
  },
}

//Same as config, except it allows multiple logic files (each validated file is treated as logic file)
const logicModuleConfig: Linter.Config = {
  ...logicConfig,
  rules: {
    ...logicConfig.rules,
    //Ignore the rule that logic has to be in one file
    "no-restricted-syntax": ["error", ...restrictedSyntaxBase],
  },
}

Object.assign(plugin.configs as any, {
  //Only validates logic files
  recommended: [
    {
      languageOptions: {
        globals: {
          Rune: "readonly",
        },
      },
    },
    {
      files: ["**/logic.ts", "**/logic.js"],
      ...logicModuleConfig,
    },
  ],
  logic: logicConfig,
  logicModule: logicModuleConfig,
})

module.exports = plugin
