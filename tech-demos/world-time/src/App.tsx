import { useEffect, useState } from "react"

import { GameStateWithPersisted } from "./logic.ts"
import { PlayerId } from "rune-sdk"

export function formatTime(time: number) {
  if (time < 120) {
    return `${time} sec`
  } else if (time < 7200) {
    return `${Math.floor(time / 60)} min`
  } else {
    return `${Math.floor(time / 3600)} hours`
  }
}

function App() {
  const [game, setGame] = useState<GameStateWithPersisted>()
  const [yourPlayerId, setYourPlayerId] = useState<PlayerId | undefined>()

  useEffect(() => {
    Rune.initClient({
      onChange: ({ game, yourPlayerId }) => {
        setGame(game)
        setYourPlayerId(yourPlayerId)
      },
    })
  }, [])

  if (!game || !yourPlayerId) {
    // Rune only shows your game after an onChange() so no need for loading screen
    return
  }

  return (
    <>
      {!game.persisted[yourPlayerId].gameStartedAt ? (
        <div>You pressed the button :(</div>
      ) : (
        <>
          <div>You didn&#39;t tap the button for</div>
          <div>World time</div>
          <div>
            {formatTime(
              (Rune.worldTime() - game.persisted[yourPlayerId].gameStartedAt!) /
                1000
            )}
          </div>
          <div>Game opened time</div>
          <div>
            {formatTime(game.persisted[yourPlayerId].inGameTimeInSeconds!)}
          </div>
          <div>Current game session time</div>
          <div>{formatTime(game.sessionPlayTime[yourPlayerId])}</div>
        </>
      )}
      <div className={"buttonContainer"}>
        <button className="pushable" onClick={() => Rune.actions.tap()}>
          <span className="front">Don&#39;t tap me</span>
        </button>
      </div>
    </>
  )
}

export default App
