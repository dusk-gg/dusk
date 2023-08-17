import { useAtomValue } from "jotai"
import { $players, $yourPlayer } from "../../state/$state"
import { useMemo } from "react"
import styled from "styled-components/macro"

import logo from "./logo.svg"
import { rel } from "../../style/rel"

export function Start() {
  const players = useAtomValue($players)
  const yourPlayer = useAtomValue($yourPlayer)

  const numReady = useMemo(
    () => players.filter((p) => p.readyToStart).length,
    [players]
  )

  return (
    <Root>
      <LogoImg src={logo} />
      <ReadyLabel>
        {numReady}/{players.length}
        <br />
        Players Ready
      </ReadyLabel>
      <ReadyButton
        visible={!!yourPlayer && !yourPlayer.readyToStart}
        onClick={() => Rune.actions.setReadyToStart()}
      >
        <div>I'm Ready</div>
      </ReadyButton>
    </Root>
  )
}

const Root = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  padding: 5vh 0;
`

const LogoImg = styled.img`
  width: ${rel(231)};
`

const ReadyLabel = styled.div`
  font-size: ${rel(28)};
  color: white;
  text-shadow: 0 ${rel(3)} 0 rgba(0, 0, 0, 0.35);
  text-align: center;
`

const ReadyButton = styled.div<{ visible: boolean }>`
  width: ${rel(336)};
  visibility: ${({ visible }) => (visible ? "visible" : "hidden")};

  background: linear-gradient(180deg, #ffbbca 0%, #ffbbca 0.01%, #ffeaee 100%);
  border-radius: ${rel(24)};
  padding: ${rel(8)};
  cursor: pointer;

  > div {
    background: white;
    border-radius: ${rel(24 - 8)};
    font-size: ${rel(24)};
    color: #af41d1;
    padding: ${rel(32 - 8)};
    text-align: center;
  }
`
