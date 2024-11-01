import React from "react"
import { GamePage } from "../../components/GamePage"
import BrowserOnly from "@docusaurus/BrowserOnly"

export default function ThreeJS() {
  return (
    <BrowserOnly>
      {() => <GamePage title="ThreeJS" slug="threejs" techDemo={true} />}
    </BrowserOnly>
  )
}
