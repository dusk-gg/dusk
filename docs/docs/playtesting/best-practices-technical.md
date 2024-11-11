---
sidebar_position: 4
---

# Best Practices (Tech)

How to code your game to perform the best on Rune!

### Use Rune Loading Animation {#use-rune-loading-animation}

Rune shows an animation while your game is loading. It's a smoother player experience to only have one progress bar to load your game. Avoid having a loading screen in your game by waiting with calling `Rune.initClient()` until your game has fully completed loading.

### Keep Loading Time short {#keep-loading-time-short}

Your game should load as quickly as possible to get players into the action as soon as possible. Load any large assets that aren't required for game play asynchronously.

### Send Player Input rather than Player State in Actions {#send-player-input}

We recommend sending player input in actions (e.g. "turning left") rather than player state (e.g. the player's position). This minimizes network data and allows other clients to simulate ahead, thereby making your game work better in bad network settings. Similarly, only send an action when the input changes instead of sending the same player input repeatedly.

### No Ads, Branding and Links {#no-ads-branding-and-links}

One of the amazing things about Rune is that there’s no ads. Leave out any ads, branding and links from your game to keep the focus on the gameplay experience 🧘

### No Network Requests or External Resources {#no-network-requests}

Your game should not use any network requests or external resources. Avoiding these protect player privacy/security and guarantees that your game will keep running even if some external servers get shutdown.

### Gameplay Should not be Affected by Screen Size {#gameplay-should-not-be-affected-by-screen-size}

Your game should ideally scale from small narrow phones with resolutions like 280×653 to wide tablets with resolutions like 1280×800. The gameplay area can be even less on small phones, e.g. only 450 pixels high. Gameplay should not be affected by aspect ratio or resolution. Make sure your game scales to cover the entire screen to provide the best experience.