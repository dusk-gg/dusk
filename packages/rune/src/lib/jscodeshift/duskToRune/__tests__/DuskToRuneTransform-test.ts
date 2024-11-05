import { defineTest } from "jscodeshift/src/testUtils"

defineTest(__dirname, "DuskToRuneTransform", null, "Logic", { parser: "ts" })
defineTest(__dirname, "DuskToRuneTransform", null, "Client")
