// @ts-check
const { createConfigTester } = require("../createConfigTester.js")

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
    "parseFloat('1.123')",
    "globalThis.Math.pow()",
    "new Set()",
    "console.log(123)",
    "new Date(1234)",
    "new Date(1234).getHour()",
    "new Date('2024-01-01')",
  ],
  invalid: [
    ["Prune.initLogic()", "no-undef"],
    ["Object.assign(window, { hest: 'snel' })", "no-restricted-globals"],
    ['require("hest")', "no-undef"],
    ["window.Math.pow()", "no-restricted-globals"],
    ["global.Math.pow()", "no-restricted-globals"],
    ["Performance.now()", "no-restricted-globals"],
    ["performance.now()", "no-restricted-globals"],
    ["global.hest = 'snel'", "rune/no-global-scope-mutation"],
    ["globalThis.hest = 'snel'", "rune/no-global-scope-mutation"],
    ["globalThis.Math.cos = () => {};", "rune/no-global-scope-mutation"],
    ["new XMLHttpRequest()", "no-restricted-globals"],
    ["fetch('https://rune.ai')", "no-restricted-globals"],
    ["setTimeout(() => {})", "no-restricted-globals"],
    ["clearTimeout()", "no-restricted-globals"],
    ["setInterval()", "no-restricted-globals"],
    ["clearInterval()", "no-restricted-globals"],
    ["alert()", "no-restricted-globals"],
    ["Rune.init()", "no-restricted-properties"],
    ["Rune.initClient()", "no-restricted-properties"],
    ["Rune.deterministicRandom(1)", "no-restricted-properties"],
    ['eval("hest")', "no-restricted-globals"],
    ["new Date()", "no-restricted-syntax"],
    ["Date.now()", "no-restricted-syntax"],
    ["Date()", "no-restricted-syntax"],
    ["new Intl.NumberFormat()", "no-restricted-globals"],
    ["new Symbol()", "no-restricted-globals"],
    ["parseFloat = function() {}", "no-global-assign"],
    ['Math.floor(3).toLocaleString("en-US")', "no-restricted-properties"],
    ["'abc'.toLocaleLowerCase()", "no-restricted-properties"],
    ["'abc'.toLocaleUpperCase()", "no-restricted-properties"],
    ["'abc'.localeCompare()", "no-restricted-properties"],
    ["x.then(y)", "no-restricted-properties"],
  ],
}))
