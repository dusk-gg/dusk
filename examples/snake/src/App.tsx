import "./base.css"

import { useEffect, useRef } from "react"
import {
  boardSize,
  Point,
  forwardSpeedPixelsPerTick,
  turningSpeedDegreesPerTick,
  degreesToRad,
} from "./logic.ts"
import { styled } from "styled-components"
import { rel } from "./lib/rel.ts"
import { InputTracker } from "./components/InputTracker.tsx"
import { $state, store } from "./state/state.ts"

function draw(canvas: HTMLCanvasElement) {
  const game = store.get($state).game

  if (canvas) {
    const ctx = canvas.getContext("2d")

    if (ctx) {
      // eslint-disable-next-line no-inner-declarations
      function drawPoint(point: Point, color = "red") {
        if (!ctx) return
        const radius = 7.5
        ctx.beginPath()
        ctx.arc(point.x, point.y, radius, 0, 2 * Math.PI)
        ctx.strokeStyle = color
        ctx.lineWidth = 1
        ctx.stroke()
      }

      // eslint-disable-next-line no-inner-declarations
      function drawLine(start: Point, end: Point) {
        if (!ctx) return
        ctx.beginPath()
        ctx.moveTo(start.x, start.y)
        ctx.lineTo(end.x, end.y)
        ctx.lineWidth = 15
        ctx.strokeStyle = "rgba(0,255,0,.5)"
        ctx.stroke()
      }

      // eslint-disable-next-line no-inner-declarations
      function drawArc(
        initialAngle: number,
        endAngle: number,
        clockwise: boolean,
        start: Point
      ) {
        // let nextX = start.x
        // let nextY = start.y
        // let nextAngle = initialAngle
        // for (let i = 0; i < 100; i++) {
        //   nextAngle += turningSpeedDegreesPerTick
        //   nextX =
        //     nextX +
        //     Math.cos(nextAngle * (Math.PI / 180)) * forwardSpeedPixelsPerTick
        //   nextY =
        //     nextY +
        //     Math.sin(nextAngle * (Math.PI / 180)) * forwardSpeedPixelsPerTick
        //   drawPoint({ x: nextX, y: nextY }, "green")
        // }

        if (!ctx) return

        const arcRadius =
          (180 * forwardSpeedPixelsPerTick) /
          (Math.PI * turningSpeedDegreesPerTick)

        const turningMod = clockwise ? 1 : -1

        const angleToCenter =
          initialAngle + (+90 + turningSpeedDegreesPerTick / 2) * turningMod

        const arcCenter = {
          x: start.x + Math.cos(degreesToRad(angleToCenter)) * arcRadius,
          y: start.y + Math.sin(degreesToRad(angleToCenter)) * arcRadius,
        }

        drawPoint(arcCenter, "yellow")

        const arcStartAngle = degreesToRad(
          initialAngle + (-90 + turningSpeedDegreesPerTick / 2) * turningMod
        )
        const arcEndAngle = degreesToRad(
          endAngle + (-90 + turningSpeedDegreesPerTick / 2) * turningMod
        )

        // arcStartAngle = degreesToRad(0)
        // arcEndAngle = degreesToRad(360)

        ctx.beginPath()
        ctx.arc(
          arcCenter.x,
          arcCenter.y,
          arcRadius,
          arcStartAngle,
          arcEndAngle,
          !clockwise
        )
        ctx.lineWidth = 15
        ctx.strokeStyle = "rgba(255,0,0,.5)"
        ctx.stroke()
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      ctx.strokeStyle = "#10D4FF"
      ctx.lineWidth = 2
      ctx.shadowColor = "#10D4FF"
      ctx.fillStyle = "red"

      for (const player of game.players) {
        const line = player.line

        for (const section of line) {
          if (section.turning !== "none") {
            drawArc(
              section.startAngle,
              section.endAngle,
              section.turning === "right",
              section.start
            )
          } else {
            drawLine(section.start, section.end)
          }

          drawPoint(section.start)
          drawPoint(section.end)
        }
      }
    }
  }
}

export function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    let handle: ReturnType<typeof requestAnimationFrame> | undefined
    function tick() {
      if (canvasRef.current) draw(canvasRef.current)
      // if (canvas2Ref.current) draw(canvas2Ref.current)

      handle = requestAnimationFrame(tick)
    }

    tick()

    return () => {
      if (handle) cancelAnimationFrame(handle)
    }
  }, [])

  console.log("render")
  return (
    <>
      <InputTracker />
      <Root>
        <Header />
        <div style={{ position: "relative" }}>
          <Canvas
            ref={canvasRef}
            width={boardSize.width}
            height={boardSize.height}
          />
        </div>
      </Root>
    </>
  )
}

const Root = styled.div`
  width: 100%;
  height: 100%;
  background: black;
`

const Header = styled.div`
  height: ${rel(100)};
  background: green;
`

const Canvas = styled.canvas`
  border: 1px dashed red;
  width: 100%;
  aspect-ratio: ${boardSize.width} / ${boardSize.height};
`
