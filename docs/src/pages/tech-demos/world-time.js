import React from "react"
import { GamePage } from "../../components/GamePage"
import BrowserOnly from "@docusaurus/BrowserOnly"

export default function WorldTime() {
  return (
    <BrowserOnly>
      {() => <GamePage title="World Time" slug="world-time" techDemo={true} />}
    </BrowserOnly>
  )
}
