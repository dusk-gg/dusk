import { useAtomValue } from "jotai"
import { $actorPlayer, $yourPlayerId } from "../../state/$state"
import styled from "styled-components/macro"
import { rel } from "../../style/rel"
import { Confetti } from "./CorrectGuess"
import confettiAnimation from "./lottie/confetti.json"
import { useEffect, memo } from "react"
import { sounds } from "../../sounds/sounds"

export const EndOfTurn = memo(() => {
  const actorPlayer = useAtomValue($actorPlayer)
  const yourPlayerId = useAtomValue($yourPlayerId)

  useEffect(() => {
    sounds.endOfTurn.play()
  }, [])

  return (
    <Root>
      {!!actorPlayer?.latestTurnScore ? (
        actorPlayer.id === yourPlayerId ? (
          <>
            <Confetti autoplay keepLastFrame src={confettiAnimation} />
            <Heading>Great job!</Heading>
            <div style={{ height: rel(58) }} />
            <Score>+{actorPlayer.latestTurnScore}pt</Score>
            <Label>Points</Label>
          </>
        ) : (
          <>
            <Label>{actorPlayer.info.displayName}</Label>
            <AvatarImg src={actorPlayer.info.avatarUrl} />
            <Score>+{actorPlayer.latestTurnScore}pt</Score>
            <Label>Points</Label>
            <Label>For acting</Label>
          </>
        )
      ) : (
        <Label>Better luck next time!</Label>
      )}
    </Root>
  )
})

const Root = styled.div`
  animation: fadeIn 300ms ease-out forwards;
  display: flex;
  flex-direction: column;
  align-items: center;
  > :not(:first-child) {
    margin-top: ${rel(5)};
  }
`

const Heading = styled.div`
  font-size: ${rel(64)};
  text-shadow: 0 ${rel(3)} 0 rgba(0, 0, 0, 0.35);
`

const Score = styled.div`
  font-size: ${rel(38)};

  background: #23490c;
  -webkit-background-clip: text;
  -webkit-text-stroke: ${rel(1)} transparent;
  background-clip: text;
  text-stroke: ${rel(1)} transparent;
  // this is needed for the stroke renders nicely
  padding: ${rel(1)};

  color: #69c251;
  text-shadow: 0 ${rel(4.5)} ${rel(4.5)} rgba(0, 0, 0, 0.25);
`

const Label = styled.div`
  font-size: ${rel(28)};
  text-shadow: 0 ${rel(3)} 0 rgba(0, 0, 0, 0.35);
`

const AvatarImg = styled.img`
  width: ${rel(94)};
  height: ${rel(94)};
`
