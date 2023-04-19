import styled from "styled-components/macro"
import React from "react"
import range from "lodash/range"
import { Sudoku } from "sudoku-gen/dist/types/sudoku.type"

export function Board({ sudoku }: { sudoku: Sudoku }) {
  return (
    <Root>
      {range(0, 9).map((row) => (
        <Row key={row}>
          {range(0, 9).map((col) => (
            <Cell key={col}>{sudoku.puzzle[row * 9 + col]}</Cell>
          ))}
        </Row>
      ))}
    </Root>
  )
}

const Root = styled.div`
  width: 100vw;
  height: 100vw;
  display: flex;
  flex-direction: column;
  > :not(:first-child) {
    margin-top: 1px;
    :nth-child(3n + 1) {
      margin-top: 3px;
    }
  }
`

const Row = styled.div`
  display: flex;
  flex: 1;
  > :not(:first-child) {
    margin-left: 1px;
    :nth-child(3n + 1) {
      margin-left: 3px;
    }
  }
`

const Cell = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: #0b1c24;
  color: #995618;
  font-weight: 600;
  font-size: 24px;
`
