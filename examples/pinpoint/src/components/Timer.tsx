import { $roundTimerStartedAt } from "../state/game"
import { useAtomValue } from "jotai"
import { useEffect, useState, useMemo } from "react"
import { roundDuration } from "../logic"
import styled, { css } from "styled-components/macro"
import { sounds } from "../sounds/sounds"

export function Timer() {
  const roundTimerStartedAt = useAtomValue($roundTimerStartedAt)
  const [value, setValue] = useState<number | null>(null)

  useEffect(() => {
    let handle: ReturnType<typeof requestAnimationFrame> | undefined

    if (roundTimerStartedAt) {
      const startedAt =
        Date.now() - (Rune.gameTime() / 1000 - roundTimerStartedAt) * 1000

      const tick = () => {
        const value = roundDuration - (Date.now() - startedAt) / 1000 - 0.5

        if (value <= 0) {
          setValue(0)
        } else {
          setValue(value)
          handle = requestAnimationFrame(tick)
        }
      }

      tick()
    } else {
      setValue(null)
    }

    return () => {
      if (handle) cancelAnimationFrame(handle)
    }
  }, [roundTimerStartedAt])

  const path = useMemo(() => {
    if (value === null) return ""

    const sector = 1 - (roundDuration - value) / roundDuration

    const [startX, startY] = calculateCoordinates(0)
    const [endX, endY] = calculateCoordinates(sector)
    const largeArcFlag = sector > 0.5 ? 1 : 0

    return [
      `M ${startX} ${startY}`, // Move
      `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`, // Arc
      "L 0 0", // Line
    ].join(" ")
  }, [value])

  const almostOver = value !== null && value <= 5

  useEffect(() => {
    if (almostOver) sounds.timer.play()

    return () => {
      sounds.timer.stop()
    }
  }, [almostOver])

  if (value === null) return null

  return (
    <Root>
      <SvgRoot viewBox="-1 -1 2 2" almostOver={almostOver}>
        <path d={path}></path>
      </SvgRoot>
      <Text almostOver={almostOver}>{Math.ceil(value)}</Text>
    </Root>
  )
}

const Root = styled.div`
  pointer-events: none;

  @keyframes timerReveal {
    0% {
      transform: scale(0);
      right: calc(50% - 7.5vw);
      top: calc(40% - 7.5vw);
    }
    25% {
      transform: scale(3);
      right: calc(50% - 7.5vw);
      top: calc(40% - 7.5vw);
    }
    75% {
      transform: scale(3);
      right: calc(50% - 7.5vw);
      top: calc(40% - 7.5vw);
    }
    100% {
      transform: scale(1);
      top: 15px;
      right: 10px;
    }
  }

  animation: timerReveal 1.5s ease-in;

  position: absolute;
  width: 15vw;
  height: 15vw;
  top: 15px;
  right: 5px;
  z-index: 1;

  display: flex;
  align-items: center;
  justify-content: center;
`

const SvgRoot = styled.svg<{ almostOver: boolean }>`
  position: absolute;
  transform: rotate(-90deg) scaleY(-1);
  border-radius: 50%;
  
  ${({ almostOver }) =>
    almostOver
      ? css`
          border: 2px solid #f34545;
          path {
            fill: rgba(243, 69, 69, 0.4);
          }
        `
      : css`
          border: 2px solid #008979;
          path {
            fill: rgba(1, 164, 145, 0.4);
          }
        `}};

`

const Text = styled.div<{ almostOver: boolean }>`
  font-weight: 600;
  font-size: 20px;
  color: ${({ almostOver }) => (almostOver ? "#F34545" : "#85ffe2")};
  z-index: 1;
`

function calculateCoordinates(value: number) {
  const x = Math.cos(2 * Math.PI * value)
  const y = Math.sin(2 * Math.PI * value)
  return [x, y]
}
