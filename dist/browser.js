/*
The SDK interface for games to interact with Rune.
*/
var Rune = {
    // External properties and functions
    version: "1.4.0",
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
        RuneLib.validateScore(getScore());
        // Initialize the SDK with the game's functions
        Rune._startGame = startGame;
        Rune._resumeGame = resumeGame;
        Rune._pauseGame = pauseGame;
        Rune._getScore = getScore;
        // When running inside Rune, runePostMessage will always be defined.
        if (window.postRuneEvent) {
            window.postRuneEvent({ type: "INIT", version: Rune.version });
        }
        else {
            RuneLib.mockEvents();
        }
    },
    getChallengeNumber: function () { var _a; return (_a = window._runeChallengeNumber) !== null && _a !== void 0 ? _a : 1; },
    gameOver: function () {
        var _a;
        if (!Rune._doneInit) {
            throw new Error("Rune.gameOver() called before Rune.init()");
        }
        var score = Rune._getScore();
        RuneLib.validateScore(score);
        (_a = window.postRuneEvent) === null || _a === void 0 ? void 0 : _a.call(window, { type: "GAME_OVER", score: score, challengeNumber: Rune.getChallengeNumber() });
    },
    // Internal properties and functions used by the Rune app
    _doneInit: false,
    _requestScore: function () {
        var _a;
        var score = Rune._getScore();
        RuneLib.validateScore(score);
        (_a = window.postRuneEvent) === null || _a === void 0 ? void 0 : _a.call(window, { type: "SCORE", score: score, challengeNumber: Rune.getChallengeNumber() });
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
    }
};
// Helper functions (namedspaced to avoid conflicts)
var RuneLib = {
    validateScore: function (score) {
        if (typeof score !== "number") {
            throw new Error("Score is not a number. Received: " + typeof score);
        }
        if (score < 0 || score > Math.pow(10, 9)) {
            throw new Error("Score is not between 0 and 1000000000. Received: " + score);
        }
        if (!Number.isInteger(score)) {
            throw new Error("Score is not an integer. Received: " + score);
        }
    },
    // Create mock events to support development
    mockEvents: function () {
        // Log posted events to the console (in production, these are processed by Rune)
        window.postRuneEvent = function (event) {
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
            var score = Rune._getScore();
            RuneLib.validateScore(score);
            (_a = window.postRuneEvent) === null || _a === void 0 ? void 0 : _a.call(window, { type: "GAME_OVER", score: score, challengeNumber: Rune.getChallengeNumber() });
            console.log("RUNE: Starting new game in 3 seconds.");
            setTimeout(function () {
                Rune._startGame();
                console.log("RUNE: Started new game.");
            }, 3000);
        };
    }
};
