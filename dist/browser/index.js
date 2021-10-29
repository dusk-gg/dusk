/*
The SDK interface for games to interact with Rune.
*/
export var Rune = {
    // External properties and functions
    version: "1.3.0",
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
        validateScore(getScore());
        // Initialize the SDK with the game's functions
        Rune._startGame = startGame;
        Rune._resumeGame = resumeGame;
        Rune._pauseGame = pauseGame;
        Rune._getScoreFromGame = getScore;
        // When running inside Rune, runePostMessage will always be defined.
        if (globalThis.postRuneEvent) {
            globalThis.postRuneEvent({ type: "INIT", version: Rune.version });
        }
        else {
            mockEvents();
        }
    },
    gameOver: function () {
        var _a;
        if (!Rune._doneInit) {
            throw new Error("Rune.gameOver() called before Rune.init()");
        }
        var score = Rune._getScoreFromGame();
        validateScore(score);
        (_a = globalThis.postRuneEvent) === null || _a === void 0 ? void 0 : _a.call(globalThis, { type: "GAME_OVER", score: score });
    },
    // Internal properties and functions used by the Rune app
    _doneInit: false,
    _getScore: function () {
        var _a;
        var score = Rune._getScoreFromGame();
        validateScore(score);
        (_a = globalThis.postRuneEvent) === null || _a === void 0 ? void 0 : _a.call(globalThis, { type: "SCORE", score: score });
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
    _getScoreFromGame: function () {
        throw new Error("Rune._getScoreFromGame() called before Rune.init()");
    }
};
var validateScore = function (score) {
    if (typeof score !== "number") {
        throw new Error("Score is not a number. Received: " + typeof score);
    }
    if (score < 0 || score > Math.pow(10, 9)) {
        throw new Error("Score is not between 0 and 1000000000. Received: " + score);
    }
    if (!Number.isInteger(score)) {
        throw new Error("Score is not an integer. Received: " + score);
    }
};
// Create mock events to support development
var mockEvents = function () {
    // Log posted events to the console (in production, these are processed by Rune)
    globalThis.postRuneEvent = function (event) {
        return console.log("RUNE: Posted " + JSON.stringify(event));
    };
    // Mimic the user tapping Play after 3 seconds
    console.log("RUNE: Starting new game in 3 seconds.");
    setTimeout(function () {
        Rune._startGame();
        console.log("RUNE: Started new game.");
    }, 3000);
    // Automatically restart game 3 seconds after Game Over
    Rune.gameOver = function () {
        var _a;
        var score = Rune._getScoreFromGame();
        validateScore(score);
        (_a = globalThis.postRuneEvent) === null || _a === void 0 ? void 0 : _a.call(globalThis, { type: "GAME_OVER", score: score });
        console.log("RUNE: Starting new game in 3 seconds.");
        setTimeout(function () {
            Rune._startGame();
            console.log("RUNE: Started new game.");
        }, 3000);
    };
};
