---
sidebar_position: 3
---

# Best Practices (Gameplay)

Here's some advice on making your game a great experience for the players!

### Ease Players Into Your Game {#gameplay-should-start-easy-and-simple}

As a game dev, it's easy to think that your game is very simple to understand. That's because you made it 😅 Players will need to understand how your game works and what everything means. For that reason, we highly recommend you start your game with extremely simple gameplay that's very intuitive.

### Support Solo Play {#support-solo-play}

Many players like to try out your game alone before showing it to their friends. Your game is therefore more likely be picked up by the community if players can play it alone.

### Support Two Players {#support-two-players}

The majority of rooms on Rune have exactly two players. For your game to be most successful, we recommend that it supports playing and is fun when played with one other person.

### Support Spectating {#support-spectators}

Players on Rune can spectate your game 👀 This can happen in many ways, e.g. if someone joins after the room has hit your game's `maxPlayers` or if someone joins after your game has called `Rune.gameOver()`. You can identify spectators by having `yourPlayerId` as undefined (see [Player Info](../how-it-works/player-info.md)). Spectators should see all gameplay, but not have any UI for performing actions.

### Avoid UI Like Menu Screens, Pause Buttons, Audio Buttons, etc. {#avoid-ui-like-menu-screens-pause-buttons-high-score-screen-etc}

Rune’s UI provides a simple way to play/pause/restart that works for all games so you don’t need a menu screen or a pause button in your game. This lets players get into the action of your game, thereby making it faster to start playing and more fun for players! Similarly, there's no need for any audio buttons as Rune has in-app UI for that, making things simpler for players.

### Use Icons Instead of Text {#use-icons-instead-of-text}

Most players prefer visual explanations over reading. It's ideal if your game can be understood without reading any text.

### Translate Text For Non-English Players {#translate-text}

There's many non-English players on Rune so you increase your game's chances of success if you internationalize it by translating all text. The biggest non-English audiences on Rune speak Spanish, Russian and Portuguese so translate your game into those languages.

Description of your game is already [auto-translated](../publishing/game-info#game-title-and-description).

### Use Rune Avatars {#avatars}

Players recognize their friends via their avatars and enjoy seeing their own carefully-designed avatar inside your game. See [player info](../how-it-works/player-info.md#avatars) for how to show someone's avatar inside your game.

### Persist Player Progress Across Game Sessions {#persist-player-progress}

Players enjoy when they make progress in your game across sessions such as unlocking new content or achieving high scores. Use Rune's built-in [persistence API](../advanced/persisted-data.md) to save data in a reliable way that automatically syncs it across a user's devices. Avoid using cookies, local stage or IndexedDB as the OS may reset those.

### Polish Your Rune Profile {#polish-your-rune-profile}

Adjust your name, avatar, and description in Rune app Profile tab. Your profile will be publicly visible in Rune app for games that you have created or contributed to.
