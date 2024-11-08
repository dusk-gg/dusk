import { defineTest } from "jscodeshift/src/testUtils"

defineTest(__dirname, "ViteTransform", null, "vite.config", { parser: "ts" })
