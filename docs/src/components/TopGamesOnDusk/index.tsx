import React, { useEffect, useMemo, useState } from "react"
import { TopGame } from "./TopGame"
import styles from "./styles.module.scss"
import { OtherGame } from "./OtherGame"

export function TopGamesOnDusk() {
  const [gameRes, setGameRes] = useState<GameRes>(initialGameRes)
  const [error, setError] = useState(false)

  useEffect(() => {
    getGameRes()
      .then(setGameRes)
      .catch(() => setError(true))
  }, [])

  const dateStartFormatted = useMemo(() => {
    if (!gameRes?.dateStart) return null

    const locale = "en"
    const day = gameRes.dateStart.toLocaleDateString(locale, { day: "numeric" })
    const month = gameRes.dateStart.toLocaleDateString(locale, {
      month: "long",
    })
    const year = gameRes.dateStart.toLocaleDateString(locale, {
      year: "numeric",
    })

    return `${month} ${day}, ${year}`
  }, [gameRes?.dateStart])

  if (error) {
    return <p>Failed to fetch games. Try again!</p>
  }

  return (
    <div className={styles.container}>
      <h2>Week of {dateStartFormatted}</h2>
      <ol className={styles.topGames}>
        <TopGame game={gameRes.games[0]} place={1} />
        <TopGame game={gameRes.games[1]} place={2} />
        <TopGame game={gameRes.games[2]} place={3} />
      </ol>
      <p className={styles.info}>
        Each game's percentage of last week's total playtime.
      </p>
      <ol className={styles.otherGames} start={3}>
        {gameRes.games.slice(3).map((game, idx) => {
          return <OtherGame key={idx} game={game} />
        })}
      </ol>
    </div>
  )
}

export type Game = {
  title: string
  shareLink: string
  previewImgUrl: string
  weeklyPlayTimePct: number
  developers: { name: string; avatarUrl: string }[]
}

type GameRes = {
  dateStart: Date | null
  games: (Game | null)[]
}

const initialGameRes: GameRes = {
  dateStart: null,
  games: new Array(10).fill(null),
}

async function getGameRes() {
  const res = await fetch(
    "https://tango-production.rune.ai/v1/public/games-top-10"
  )
  const json = await res.json()

  if (!json.success) {
    throw new Error("Failed to fetch top games")
  }

  return {
    ...json,
    dateStart: new Date(json.dateStart),
  } as GameRes
}
