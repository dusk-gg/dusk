// @ts-check
const { createConfigTester } = require("../createConfigTester")

const test = createConfigTester()

test("globals", () => ({
  valid: [
    "Rune.initLogic()",
    "Math.abs()",
    "Math.round()",
    "Math.cos()",
    "Math.sin()",
    "Math.pow()",
    "Math.log()",
    "Math.random()",
    "123 * Math.PI",
    "const matematik = {}; Object.assign(matematik, { hest: 'snel' })",
    "isNaN(12)",
    "isFinite(12)",
    "Number.isNaN(12)",
    "if (42 < Infinity) { }",
    "if (typeof Rune === 'undefined') { }",
  ],
  invalid: [
    ["Prune.initLogic()", "no-undef"],
    ["Object.assign(window, { hest: 'snel' })", "no-undef"],
    ['require("hest")', "no-undef"],
    ["Performance.now()", "no-undef"],
    ["global.hest = 'snel'", "no-undef"],
    ["globalThis.hest = 'snel'", "no-undef"],
    ["new XMLHttpRequest()", "no-undef"],
    ["fetch('https://rune.ai')", "no-undef"],
    ["setTimeout()", "no-undef"],
    ["clearTimeout()", "no-undef"],
    ["setInterval()", "no-undef"],
    ["clearInterval()", "no-undef"],
    ["alert()", "no-undef"],
    ["Rune.init()", "no-restricted-properties"],
    ["Rune.initClient()", "no-restricted-properties"],
    ["Rune.deterministicRandom(1)", "no-restricted-properties"],
    ['eval("hest")', "no-restricted-globals"],
    ["new Date()", "no-restricted-globals"],
    ["const date = Date; date.now()", "no-restricted-globals"],
    ["Date.now()", "no-restricted-globals"],
    ["new Intl.NumberFormat()", "no-restricted-globals"],
    ["new Symbol()", "no-restricted-globals"],
  ],
}))
