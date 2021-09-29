"use strict";
/*
The SDK interface for games to interact with Rune.
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rune = void 0;
exports.Rune = {
    // Make functions throw until init()
    startGame: () => {
        throw new Error("Rune.startGame() called before Rune.init()");
    },
    resumeGame: () => {
        throw new Error("Rune.resumeGame() called before Rune.init()");
    },
    pauseGame: () => {
        throw new Error("Rune.pauseGame() called before Rune.init()");
    },
    gameOver: () => {
        throw new Error("Rune.gameOver() called before Rune.init()");
    },
    init: (input) => {
        // Check that game provided correct input to SDK
        const { startGame, resumeGame, pauseGame } = input || {};
        if (typeof startGame !== "function") {
            throw new Error("Invalid startGame function provided to Rune.init()");
        }
        if (typeof resumeGame !== "function") {
            throw new Error("Invalid resumeGame function provided to Rune.init()");
        }
        if (typeof pauseGame !== "function") {
            throw new Error("Invalid pauseGame function provided to Rune.init()");
        }
        // Initialize the SDK with the game's functions
        exports.Rune.startGame = startGame;
        exports.Rune.resumeGame = resumeGame;
        exports.Rune.pauseGame = pauseGame;
        // When running inside Rune, the env RUNE_PLATFORM will always be provided.
        // The gameOver function will be provided by the Rune.
        if (process.env.RUNE_PLATFORM === undefined) {
            // If debugging locally, mimic events and e.g. start a new game after finishing
            exports.Rune.gameOver = function ({ score }) {
                console.log(`RUNE: Successfully communicated score of ${score}.`);
                console.log(`RUNE: Starting new game in 3 seconds.`);
                setTimeout(() => {
                    exports.Rune.startGame();
                    console.log(`RUNE: Started new game.`);
                }, 3000);
            };
        }
    },
    // Allow Rune to see which SDK version the game is using
    version: "1.0.0",
};
//# sourceMappingURL=index.js.map