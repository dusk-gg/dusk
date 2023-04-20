const { createConfigTester } = require("../createConfigTester")

const test = createConfigTester({
  extends: "plugin:rune/logic",
})

test("variable scope", {
  valid: [
    "(() => { let hest; hest = 'snel' })()",
    "() => { Rune.initLogic() }",
    "const hest = 'snel'; if (hest = 'klad') { Rune.initLogic(); }",
    "const hest = 'snel'; if (hest === 'klad') { Rune.initLogic(hest); }",
    "const hest = 'snel'; () => { if (hest === 'snel') { return 'klad'; } }",
    "const hest = { snel: true }; () => { if (hest.snel === true) { return 'klad'; } }",
    "parseInt('1')",
    "let hest; hest === undefined",
    "const hest = null",
    "let hest; (() => { let hest; hest = 'snel' })()",
    "const hest = () => 'snel'; (() => { hest() })()",
    "const hest = ['snel']; const klap = (hest) => { hest.push('klad') }; (() => { let hest = []; klap(hest) })()",
    "const hest = { snel: true }; Object.assign(hest, { klad: true })",
    "const hest = 'snel'; () => ({ [`hest`]: 'klad' })",
    "const hest = 'snel'; () => { const hest = 'klad'; return { [`${hest}`]: 'klad' } }",
    "const hest = 'snel'; () => ({ hest() { return 'klad' } })",
    "const hest = 'snel'; class Klad { hest() { return 'snel' } }",
    "class Hest { spek() { return 'gneg' } }",
    "const hest = {}; hest.snel = true",
    "const hest = {}; (hest) => { hest.snel = true }",
    "const hest = {}; (hest) => { hest['snel'] = true }",
    "const hest = {}; (hest) => { hest.hest = true }",
    "const hest = {}; (hest) => { hest[hest] = true }",
    "const hest = {}; function klap(hest) { hest.klad = true }; klap(hest)",
    "const hest = {}; hest.klad = true",
    "let hest = {}; hest = { klad: true }",
    "let hest = {}; const snel = true; hest = snel",
    "const hest = {}; Object.defineProperty(hest, 'klad', { value: true })",
    "const hest = {}; Object.defineProperties(hest, { klad: { value: true } })",
    "const hest = {}; Object.setPrototypeOf(hest, { klad: true })",
    "const hest = 'snel'; function matematik() { return `hest = ${hest}`; }",
    "const hest = 'snel'; () => ({ [hest]: 'klad' })",
    "const hest = 'snel'; () => ({ [`${hest}`]: 'klad' })",
    "const hest = { spek: () => 'gneg' }; () => hest.spek()",
    "const hest = 'snel'; class Klad { hest() { return hest } }",
    "const hest = 'snel'; const snel = { hest }",
    "() => [Rune]",
    // These are unsafe and ways to circumvent the intention of the rule, but still allowed
    "const hest = ['snel']; const klap = (hest) => { hest.push('klad') }; (() => { klap(hest) })()",
    "[Rune].map((r) => { r.hest = 'snel' })",
    "const getSeedsByDifficulty = (seeds, difficulty) => seeds.filter((seed) => !difficulty || seed.difficulty === difficulty);",
  ],
  invalid: [
    "let hest; (() => { hest = 'snel' })()",
    "() => { let hest; () => { hest = 'snel' } }",
    "const hest = ['snel', 'klad']; (() => { hest.splice(0, 1) })()",
    "const hest = { snel: true }; () => Object.assign(hest, { klad: true })",
    "const hest = {}; () => { Object.defineProperty(hest, 'snel', { value: true }) }",
    "const hest = {}; () => { hest.snel = true }",
    "const hestar = [{}]; () => { hestar[0].snel = true }",
    "const hest = {}; () => { hest['snel'] = true }",
    "const hest = []; () => { hest.push('snel') }",
    "const hest = [[]]; () => { hest[0][0] = 'snel' }",
    "const hest = 1; () => { hest++ }",
    "const hest = 1; () => { hest += 1 }",
    "const hest = 1; () => { hest /= 1 }",
    "let hest = 1; () => { ({ hest } = { hest: 2 }); }",
    "let hest = 1; () => { ({ newValue: hest } = { newValue: 2 }); }",
    "let hest = 1; () => { ({ best: { hest } } = { best: { hest: 2 } }); }",
    "let hest = 1; () => { ([hest] = [2]); }",
    "let hest = 1; () => { let snel; ([snel, hest] = [2, 3]); }",
    "let hest = 1; () => { ([[{ hest }]] = [[{ hest: 2 }]]); }",
    "let hest = 1; () => { ([...hest] = [2]); }",
    "Rune = 'hest'",
    "Rune.blah = 'hest'",
    "let rune = Rune",
    "delete Rune",
    "delete Rune.initLogic",
    "Rune.initLogic++",
    "Rune.initLogic += 1",
    "let rune = Rune; Object.assign(rune, { hest: true })",
    "let rune = 'Rune'; rune = Rune;",
    "let rune = 'Rune'; rune = Rune.initLogic;",
    "Object.assign(Rune, { hest: true })",
    "Object.assign(Rune.initLogic, { hest: true })",
    "Object.defineProperty(Rune, 'hest', { value: true })",
    "Object.defineProperties(Rune, { hest: { value: true } })",
    "Object.__defineGetter__(Rune, () => 'hest')",
    "Object.__defineSetter__(Rune, () => 'hest')",
    "Object.setPrototypeOf(Rune, { hest: true })",
  ],
})
