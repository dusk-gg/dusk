import {
  Container,
  Graphics,
  PixiRef,
  Sprite,
  Stage,
  useApp,
  useTick,
} from "@pixi/react"
import { Texture } from "pixi.js"
import { useEffect, useRef, useState } from "react"
import { PlayerId } from "rune-sdk"

import selectSoundAudio from "./assets/select.wav"
import { GameState } from "./logic.ts"

const selectSound = new Audio(selectSoundAudio)

function App() {
  const [game, setGame] = useState<GameState>()
  const [yourPlayerId, setYourPlayerId] = useState<PlayerId | undefined>()

  useEffect(() => {
    Rune.initClient({
      onChange: ({ game, action, yourPlayerId }) => {
        setGame(game)
        setYourPlayerId(yourPlayerId)

        if (action && action.name === "claimCell") selectSound.play()
      },
    })
  }, [])

  if (!game) {
    // Rune only shows your game after an onChange() so no need for loading screen
    return
  }

  const { winCombo, lastMovePlayerId, playerIds, freeCells } = game

  return (
    <>
      <div id="board">
        <Stage options={{ backgroundAlpha: 0 }}>
          <Board yourPlayerId={yourPlayerId} game={game} />
        </Stage>
      </div>
      <ul id="playersSection">
        {playerIds.map((playerId, index) => {
          const player = Rune.getPlayerInfo(playerId)

          return (
            <li
              key={playerId}
              data-player={index.toString()}
              data-your-turn={String(
                playerIds[index] !== lastMovePlayerId && !winCombo && freeCells
              )}
            >
              <img src={player.avatarUrl} />
              <span>
                {player.displayName}
                {player.playerId === yourPlayerId && (
                  <span>
                    <br />
                    (You)
                  </span>
                )}
              </span>
            </li>
          )
        })}
      </ul>
    </>
  )
}

type BoardProps = {
  yourPlayerId?: PlayerId
  game?: GameState
}

export function Board({ yourPlayerId, game }: BoardProps) {
  const app = useApp()
  app.resizeTo = document.getElementById("board") as HTMLElement

  if (!game) {
    return null
  }

  const { cells, lastMovePlayerId, playerIds } = game

  return (
    <>
      {cells.map((cell, index) => {
        const x = index % 3
        const y = Math.floor(index / 3)

        if (cell) {
          return (
            <OccupiedSpace
              x={x}
              y={y}
              side={playerIds.indexOf(cell) === 0 ? "x" : "o"}
              key={index}
            />
          )
        }

        return (
          <EmptySpace
            x={x}
            y={y}
            canClaim={lastMovePlayerId !== yourPlayerId}
            onpointerdown={() => Rune.actions.claimCell(index)}
            key={index}
          />
        )
      })}
      <Grid />
    </>
  )
}

function Grid() {
  const app = useApp()

  const width = app.view.width / devicePixelRatio

  return (
    <Graphics
      draw={(g) => {
        g.lineStyle(4, 0x555555)

        for (let i = 1; i < 3; i++) {
          g.moveTo(i * (width / 3), 0)
          g.lineTo(i * (width / 3), width)
          g.moveTo(0, i * (width / 3))
          g.lineTo(width, i * (width / 3))
        }
      }}
    />
  )
}

function OccupiedSpace({
  x,
  y,
  side,
}: {
  x: number
  y: number
  side: "x" | "o"
}) {
  const app = useApp()
  const spriteRef = useRef<PixiRef<typeof Sprite>>(null)
  const width = app.view.width / devicePixelRatio / 3

  useTick((delta) => {
    if (spriteRef.current) {
      if (spriteRef.current.width < width - 20) {
        spriteRef.current.width += delta * 5
        spriteRef.current.height += delta * 5
      }
    }
  })

  return (
    <Sprite
      ref={spriteRef}
      image={`${side}.svg`}
      width={0}
      height={0}
      x={width * x + width / 2}
      y={width * y + width / 2}
      anchor={0.5}
    />
  )
}

function EmptySpace({
  x,
  y,
  canClaim,
  onpointerdown,
}: {
  x: number
  y: number
  canClaim: boolean
  onpointerdown: () => void
}) {
  const [hovering, setHovering] = useState(false)
  const app = useApp()
  const width = app.view.width / devicePixelRatio / 3

  if (!canClaim) {
    return null
  }

  return (
    <Container x={width * x} y={width * y}>
      {hovering && <Dot />}
      <Sprite
        interactive={true}
        texture={Texture.EMPTY}
        width={width}
        height={width}
        onpointerover={() => setHovering(true)}
        onpointerout={() => setHovering(false)}
        onpointerdown={onpointerdown}
      />
    </Container>
  )
}

function Dot() {
  const app = useApp()
  const width = app.view.width / devicePixelRatio / 3

  return (
    <Graphics
      anchor={0.5}
      draw={(g) => {
        g.beginFill(0xffffff)
        g.drawCircle(width / 2, width / 2, 10)
      }}
    />
  )
}

export default App
