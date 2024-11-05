<script lang="ts">
  import type { PlayerId } from "rune-sdk";
  import type { GameState } from "./logic";
  import selectSoundAudio from "./assets/select.wav";
  let game = $state<GameState>();
  let mPlayerId = $state<PlayerId | undefined>();
  const selectSound = new Audio(selectSoundAudio);

  $effect(() => {
    Rune.initClient({
      onChange: ({ game: newGame, action, yourPlayerId }) => {
        game = newGame;
        mPlayerId = yourPlayerId;
        if (action && action.name === "claimCell") selectSound.play();
      },
    });
  });
</script>

{#if game}
  <div id="board" class:initial={!game.lastMovePlayerId}>
    {#each game.cells as cell, index}
      {@const cellValue = cell}
      <button
        onclick={() => {
          Rune.actions.claimCell(index);
        }}
        data-player={(cellValue !== null
          ? game.playerIds.indexOf(cellValue)
          : -1
        ).toString()}
        data-dim={String(
          (game.winCombo && !game.winCombo.includes(index)) ||
            (!game.freeCells && !game.winCombo)
        )}
        {...game.cells[index] ||
        game.lastMovePlayerId === mPlayerId ||
        game.winCombo
          ? { "data-disabled": "" }
          : {}}
      >
      </button>
    {/each}
  </div>
  <ul id="playersSection">
    {#each game.playerIds as playerId, index}
      {@const player = Rune.getPlayerInfo(playerId)}
      <li
        data-player={index.toString()}
        data-your-turn={String(
          game.playerIds[index] !== game.lastMovePlayerId &&
            !game.winCombo &&
            game.freeCells
        )}
      >
        <img src={player?.avatarUrl} alt="player avatar" />
        <span>
          {player.displayName}
          {#if player.playerId === mPlayerId}
            <span>
              <br />
              (You)
            </span>
          {/if}
        </span>
      </li>
    {/each}
  </ul>
{/if}

<style>
  #board {
    width: 90vw;
    max-width: min(90vh, 600px);
    aspect-ratio: 1;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }

  @keyframes right {
    0%,
    100% {
      transform: translate(-20px);
    }
    50% {
      transform: translate(20px);
    }
  }

  @keyframes left {
    0%,
    100% {
      transform: translate(20px);
    }
    50% {
      transform: translate(-20px);
    }
  }

  button {
    position: relative;
    background: transparent;
    border: 1.3vw solid #e6e6e620;
    border-left: 0;
    border-top: 0;
    width: 100%;
    aspect-ratio: 1;
    padding: 0;
    margin: 0;
  }

  button:before {
    position: absolute;
    top: max(8%, 8px);
    left: max(8%, 8px);
    bottom: max(8%, 8px);
    right: max(8%, 8px);
    content: "";
    display: block;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    transition: opacity 1s ease-out;
  }

  button[data-dim="true"]:before {
    opacity: 0.2;
    scale: 0.8;
  }

  @keyframes scale-in {
    0% {
      transform: scale(0);
    }
    100% {
      transform: scale(1);
    }
  }

  button[data-player="0"]:before {
    background-image: url(./assets/x.svg);
    animation: scale-in 0.2s ease-in-out;
  }

  button[data-player="1"]:before {
    background-image: url(./assets/o.svg);
    animation: scale-in 0.2s ease-in-out;
  }

  button:nth-child(3n) {
    border-right: 0;
  }

  button:nth-child(7),
  button:nth-child(8),
  button:nth-child(9) {
    border-bottom: 0;
  }

  button:not([data-disabled]) {
    cursor: pointer;
  }

  @keyframes tap-to-play {
    0% {
      transform: scale(0.7);
    }
    50% {
      transform: scale(1);
    }
    100% {
      transform: scale(0.7);
    }
  }

  #board.initial button:nth-child(5)::before {
    opacity: 1;
    content: "tap to play";
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    text-align: center;
    font-size: 8vw;
    font-weight: 700;
    line-height: 11vw;
    letter-spacing: 0vw;

    background: linear-gradient(90deg, #cb89fc 0.24%, #fea9ab 96.17%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;

    animation: tap-to-play 1.5s ease-in-out infinite;
  }

  @media (hover: hover) {
    button:not([data-disabled]):after {
      content: "";
      display: block;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-top: -10%;
      margin-left: -10%;
      width: 20%;
      border-radius: 50%;
      background: #e6e6e6;
      aspect-ratio: 1;
      transition: all 0.15s ease-in-out;
      scale: 0;
    }

    button:hover:after {
      scale: 1;
    }
  }

  ul {
    list-style: none;
    font-size: min(14px, 3vw);
    padding: 0;
    font-weight: bold;
    display: flex;
    width: 100%;
    justify-content: space-around;
  }

  li {
    opacity: 0.5;
    line-height: 1.7;
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: opacity 0.2s ease-in-out;
    text-align: center;
  }

  li img {
    width: 20vw;
    height: 20vw;
    margin-top: 6.4vw;
    margin-bottom: 2.1vw;
  }

  li[data-your-turn="true"] {
    opacity: 1;
  }

  li:before {
    content: "";
    display: inline-block;
    vertical-align: middle;
    width: 13vw;
    height: 13vw;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
  }

  li[data-player="0"]:before {
    background-image: url(./assets/x.svg);
  }

  li[data-player="1"]:before {
    background-image: url(./assets/o.svg);
  }
</style>
