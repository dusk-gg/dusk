<script setup lang="ts">
defineProps<{
  playerIndex: number
  avatarUrl: string
  displayName: string
  tag: string
  isTurnHolder: boolean
}>()
</script>

<template>
  <li :class="[`player${playerIndex}`, isTurnHolder ? 'your-turn' : '']">
    <img :src="avatarUrl" />
    <span>
      {{ displayName }}
      <br v-show="!!tag" />
      {{ tag }}
    </span>
  </li>
</template>
