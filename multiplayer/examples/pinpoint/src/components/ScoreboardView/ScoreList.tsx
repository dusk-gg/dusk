import styled from "styled-components/macro"
import { Player } from "rune-games-sdk/multiplayer"
import { useMemo } from "react"
import { AnimatedNumber } from "./AnimatedNumber"
import { timings } from "../animation/config"
import {
  simpleCSSTransitionStyles,
  SimpleCSSTransition,
} from "../animation/SimpleCSSTransition"
import { sortBy } from "../../lib/sortBy"

const itemHeight = 70
const itemGap = 10

export function ScoreList({
  scores,
  myPlayerId,
  show,
  showLatestScore,
}: {
  scores: {
    player: Player
    score: number
    latestScore: number
    previousScore: number
  }[]
  myPlayerId: string | undefined
  show: "score" | "previousScore"
  showLatestScore: boolean
}) {
  const scoresFixedOrder = useMemo(
    () =>
      sortBy(
        scores,
        (item) => -item.previousScore,
        (item) => item.player.playerId
      ).map((item, i) => ({
        ...item,
        offset: (scores.indexOf(item) - i) * (itemHeight + itemGap),
      })),
    [scores]
  )

  return scores.length === 1 ? (
    <BigItem>
      <Avatar size="big" src={scores[0].player.avatarUrl} />
      <Name>
        {scores[0].player.playerId === myPlayerId
          ? "You"
          : scores[0].player.displayName}
      </Name>
      <Score>
        <AnimatedNumber value={scores[0][show]} />
      </Score>
      <SimpleCSSTransition visible={showLatestScore} duration={timings.default}>
        <LatestScoreRight>+{scores[0].latestScore}</LatestScoreRight>
      </SimpleCSSTransition>
    </BigItem>
  ) : (
    <Items>
      {scoresFixedOrder.map((item) => (
        <Item key={item.player.playerId} offset={item.offset}>
          <Avatar size="small" src={item.player.avatarUrl} />
          <Name>
            {item.player.playerId === myPlayerId
              ? "You"
              : item.player.displayName}
          </Name>
          <Score>
            <AnimatedNumber value={item[show]} />
          </Score>
          <SimpleCSSTransition
            visible={showLatestScore}
            duration={timings.default}
          >
            <LatestScore>+{item.latestScore}</LatestScore>
          </SimpleCSSTransition>
        </Item>
      ))}
    </Items>
  )
}

const BigItem = styled.div`
  background: linear-gradient(0deg, #d8f1e8, #d8f1e8), #d2d2d2;
  border-radius: 15px;
  padding: 23px 34px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  > :not(:first-child) {
    margin-top: 10px;
  }
  width: 190px;
`

const Items = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  > :not(:first-child) {
    margin-top: ${itemGap}px;
  }
`

const Item = styled.div<{ offset: number }>`
  background: linear-gradient(0deg, #d8f1e8, #d8f1e8), #d2d2d2;
  border-radius: 15px;
  padding: 10px 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 90%;
  position: relative;
  height: ${itemHeight}px;
  top: ${({ offset }) => offset}px;
  transition: top ${timings.scoreReorder}ms ease-in-out;
`

const Avatar = styled.img<{ size: "big" | "small" }>`
  width: ${({ size }) => (size === "big" ? 70 : 50)}px;
  height: ${({ size }) => (size === "big" ? 70 : 50)}px;
`

const Name = styled.div`
  font-size: 13px;
  font-weight: 400;
  color: #01a491;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 20px;
  flex: 1;
`

const Score = styled.div`
  background-color: #01a491;
  font-size: 13px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 45px;
  color: #f8fffc;
  width: 55px;
  text-align: center;
`

const LatestScore = styled.div`
  ${simpleCSSTransitionStyles({ opacity: 0 }, { opacity: 1 })};
  color: #1e6252;
  font-size: 13px;
  font-weight: 700;
  position: absolute;
  right: 30px;
  top: 2px;
  width: 55px;
  text-align: center;
`

const LatestScoreRight = styled(LatestScore)`
  top: inherit;
  bottom: 25px;
  right: 10px;
`
