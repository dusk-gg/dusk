'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function setupBrowser() {
    //Safari ios throttles requestAnimationFrame when user has not interacted with the iframe at least once.
    //In case the games are not using clicks (for instance only swiping), ios will not treat these interactions
    //with the iframe as user interacting. As a workaround, in the browser we will start overlay with
    //click events disabled and display an invisible div inside the iframe above the canvas.
    //This way the users will click on the transparent div element the very first time. We will let our client
    //know about it with BROWSER_INITIAL_OVERLAY_CLICKED event and the transparent div will remove itself.
    //Afterwards the play/pause will be once again fully controlled by our client.
    var enableInitialOverlayInBrowser = !!new URLSearchParams(globalThis.location.search).get("enableInitialOverlayInBrowser");
    if (enableInitialOverlayInBrowser) {
        document.addEventListener("DOMContentLoaded", function () {
            var div = document.createElement("div");
            div.setAttribute("style", "top: 0; bottom: 0; left: 0; right: 0; width: 100vw; height: 100vh; position: absolute; z-index: 9999;");
            div.addEventListener("click", function () {
                div.remove();
                if (globalThis.postRuneEvent) {
                    globalThis.postRuneEvent({ type: "BROWSER_INITIAL_OVERLAY_CLICKED" });
                }
            });
            document.body.appendChild(div);
            if (globalThis.postRuneEvent) {
                globalThis.postRuneEvent({ type: "BROWSER_IFRAME_LOADED" });
            }
        });
    }
}

//We clear the storage each time we reload the game.
function clearStorage() {
    if (globalThis.localStorage) {
        globalThis.localStorage.clear();
    }
    if (globalThis.sessionStorage) {
        globalThis.sessionStorage.clear();
    }
}

// This code serves as a bridge to allow cross-domain communication between the
// website and the game loaded in an iframe using the postMessage api
function setupEventBridge() {
    var _a;
    if (globalThis.postRuneEvent)
        return;
    var challengeNumber = +((_a = new URLSearchParams(globalThis.location.search).get("challengeNumber")) !== null && _a !== void 0 ? _a : "1");
    if (Number.isInteger(challengeNumber)) {
        globalThis._runeChallengeNumber = challengeNumber;
    }
    globalThis.postRuneEvent = function (event) {
        globalThis.parent.postMessage({ runeGameEvent: event }, "*");
    };
    globalThis.addEventListener("message", function (msg) {
        if (globalThis.Rune && isRuneGameMessage(msg)) {
            globalThis.Rune[msg.data.runeGameCommand.type]();
        }
    });
}
function isRuneGameMessage(msg) {
    return (typeof msg.data === "object" &&
        !!msg.data &&
        typeof msg.data.runeGameCommand === "object");
}

/*
The SDK interface for games to interact with Rune.
*/
var doneFirstPlay = false;
var Rune = {
    // External properties and functions
    version: "1.4.8",
    init: function (input) {
        // Check that this function has not already been called
        if (Rune._doneInit) {
            throw new Error("Rune.init() should only be called once");
        }
        Rune._doneInit = true;
        // Check that game provided correct input to SDK
        var _a = input || {}, startGame = _a.startGame, resumeGame = _a.resumeGame, pauseGame = _a.pauseGame, getScore = _a.getScore;
        if (typeof startGame !== "function") {
            throw new Error("Invalid startGame function provided to Rune.init()");
        }
        if (typeof resumeGame !== "function") {
            throw new Error("Invalid resumeGame function provided to Rune.init()");
        }
        if (typeof pauseGame !== "function") {
            throw new Error("Invalid pauseGame function provided to Rune.init()");
        }
        if (typeof getScore !== "function") {
            throw new Error("Invalid getScore function provided to Rune.init()");
        }
        Rune._validateScore(getScore());
        // Initialize the SDK with the game's functions
        Rune._startGame = function () {
            //Restart the random function starting from the 2nd time the game is started (due to restart/game over)
            if (doneFirstPlay) {
                Rune._resetDeterministicRandom();
            }
            doneFirstPlay = true;
            return startGame();
        };
        Rune._resumeGame = resumeGame;
        Rune._pauseGame = pauseGame;
        Rune._getScore = getScore;
        // When running inside Rune, runePostMessage will always be defined.
        if (globalThis.postRuneEvent) {
            globalThis.postRuneEvent({ type: "INIT", version: Rune.version });
        }
    },
    gameOver: function () {
        var _a;
        if (!Rune._doneInit) {
            throw new Error("Rune.gameOver() called before Rune.init()");
        }
        var score = Rune._getScore();
        Rune._validateScore(score);
        (_a = globalThis.postRuneEvent) === null || _a === void 0 ? void 0 : _a.call(globalThis, {
            type: "GAME_OVER",
            score: score,
            challengeNumber: Rune.getChallengeNumber()
        });
    },
    getChallengeNumber: function () { var _a; return (_a = globalThis._runeChallengeNumber) !== null && _a !== void 0 ? _a : 1; },
    deterministicRandom: function () {
        // The first time that this method is called, replace it with our
        // deterministic random number generator and return the first number.
        Rune._resetDeterministicRandom();
        return Rune.deterministicRandom();
    },
    // Internal properties and functions used by the Rune app
    _doneInit: false,
    _requestScore: function () {
        var _a;
        var score = Rune._getScore();
        Rune._validateScore(score);
        (_a = globalThis.postRuneEvent) === null || _a === void 0 ? void 0 : _a.call(globalThis, {
            type: "SCORE",
            score: score,
            challengeNumber: Rune.getChallengeNumber()
        });
    },
    _startGame: function () {
        throw new Error("Rune._startGame() called before Rune.init()");
    },
    _resumeGame: function () {
        throw new Error("Rune._resumeGame() called before Rune.init()");
    },
    _pauseGame: function () {
        throw new Error("Rune._pauseGame() called before Rune.init()");
    },
    _getScore: function () {
        throw new Error("Rune._getScore() called before Rune.init()");
    },
    _validateScore: function (score) {
        if (typeof score !== "number") {
            throw new Error("Score is not a number. Received: ".concat(typeof score));
        }
        if (score < 0 || score > Math.pow(10, 9)) {
            throw new Error("Score is not between 0 and 1000000000. Received: ".concat(score));
        }
        if (!Number.isInteger(score)) {
            throw new Error("Score is not an integer. Received: ".concat(score));
        }
    },
    // A pseudorandom number generator (PRNG) for determinism.
    // Based on the efficient mulberry32 with 32-bit state.
    // From https://github.com/bryc/code/blob/master/jshash/PRNGs.md.
    _randomNumberGenerator: function (seed) {
        // Initialize using hash function to avoid seed quality issues.
        // E.g. to avoid correlations between using 1 and 2 as seed.
        var hash = Rune._hashFromString(seed.toString());
        return function () {
            var t = (hash += 0x6d2b79f5);
            t = Math.imul(t ^ (t >>> 15), t | 1);
            t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    },
    // xmur3 from https://github.com/bryc/code/blob/master/jshash/PRNGs.md.
    // Returns a number as opposed to seed() function for ease of use.
    _hashFromString: function (str) {
        for (var i = 0, h = 1779033703 ^ str.length; i < str.length; i++) {
            h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
            h = (h << 13) | (h >>> 19);
        }
        var seed = function () {
            h = Math.imul(h ^ (h >>> 16), 2246822507);
            h = Math.imul(h ^ (h >>> 13), 3266489909);
            return (h ^= h >>> 16) >>> 0;
        };
        return seed();
    },
    _resetDeterministicRandom: function () {
        // Reset randomness to be deterministic across plays
        Rune.deterministicRandom = Rune._randomNumberGenerator(Rune.getChallengeNumber());
    }
};
clearStorage();
setupBrowser();
setupEventBridge();

exports.Rune = Rune;
//# sourceMappingURL=index.js.map
