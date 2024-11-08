<script setup lang="ts">
import { Player, PlayerId } from "rune-sdk"
import { ref, onMounted } from "vue"

import selectSoundAudio from "./assets/select.wav"
import CellButton from "./components/CellButton.vue"
import PlayerContainer from "./components/PlayerContainer.vue"
import { Cells } from "./logic.ts"

const selectSound = new Audio(selectSoundAudio)

const gCells = ref<Cells>([])
const gPlayers = ref<Player[]>([])
const gYourPlayerId = ref<PlayerId | undefined>()
const gLastMovePlayerId = ref<PlayerId | null>(null)
const gWinCombo = ref<number[] | null>(null)
const gFreeCells = ref<boolean>(false)

function getPlayerIndex(playerId: PlayerId | null): number {
  if (playerId === null) {
    return -1
  }
  const players = gPlayers.value
  for (let i = 0; i < players.length; ++i) {
    if (players[i].playerId === playerId) {
      return i
    }
  }
  return -1
}

onMounted(() => {
  Rune.initClient({
    onChange: ({ game, yourPlayerId, action, event }) => {
      const isInitialization =
        gCells.value.length === 0 || event?.name === "stateSync"

      gCells.value = game.cells
      gYourPlayerId.value = yourPlayerId
      gLastMovePlayerId.value = game.lastMovePlayerId
      gWinCombo.value = game.winCombo
      gFreeCells.value = !!game.freeCells

      if (isInitialization) {
        gPlayers.value = game.playerIds.map((playerId) =>
          Rune.getPlayerInfo(playerId)
        )
      }

      if (action && action.name === "claimCell") selectSound.play()
    },
  })
})
</script>

<template>
  <div id="board" :class="{ initial: !gLastMovePlayerId }">
    <CellButton
      v-for="(cell, index) in gCells"
      :key="index"
      :cell-index="index"
      :player-index="getPlayerIndex(cell)"
      :dim="
        (gWinCombo && !gWinCombo.includes(index)) || (!gFreeCells && !gWinCombo)
      "
      :disabled="cell || gLastMovePlayerId === gYourPlayerId || gWinCombo"
    />
  </div>
  <ul id="playersSection">
    <PlayerContainer
      v-for="(player, index) in gPlayers"
      :key="player.playerId"
      :player-index="index"
      :avatar-url="player.avatarUrl"
      :display-name="player.displayName"
      :tag="player.playerId === gYourPlayerId ? '(You)' : ''"
      :is-turn-holder="
        player.playerId !== gLastMovePlayerId && !gWinCombo && gFreeCells
      "
    />
  </ul>
</template>
