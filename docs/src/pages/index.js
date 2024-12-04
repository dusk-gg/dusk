import React, { useState, useRef, useCallback } from "react"
import PropTypes from "prop-types"
import clsx from "clsx"
import Link from "@docusaurus/Link"
import { Player } from "@lottiefiles/react-lottie-player"
import CodeBlock from "@theme/CodeBlock"

import styles from "./index.module.scss"
import useDocusaurusContext from "@docusaurus/useDocusaurusContext"
import Layout from "@theme/Layout"
import { HomeGameDemo } from "../components/HomeGameDemo/HomeGameDemo"
import demoCode from "./demoCode.json"
import { gameVideoSequences } from "../components/gameVideoSequences"

const features = [
  {
    icon: require("@site/static/img/home/features/players.png").default,
    title: "Millions playing your game on Rune",
    description: [
      "The Rune app has more than 10 million installs across iOS and Android.",
      "No need for you to deal with marketing or pay for ads!",
    ],
  },
  {
    icon: require("@site/static/img/home/features/code.png").default,
    title: "Use your favorite web framework",
    description: [
      "Your game can use any web framework such as React, Svelte, Vue, r3f, PixiJS.",
      "It runs smoothly inside the Rune app using a highly-optimized WebView.",
    ],
  },
  {
    icon: require("@site/static/img/home/features/heart.png").default,
    title: "It’s free for everyone",
    description: [
      "Rune is completely free for developers and players alike!",
      "We will cover our costs through a small cut on any money we help devs make.",
    ],
  },
  {
    icon: require("@site/static/img/home/features/dollar.png").default,
    title: "We help you make money",
    description: [
      "Earn money from your game without dealing with ads or purchases.",
      "Rune's creator fund pays you directly based on your game's stats.",
    ],
  },
  {
    icon: require("@site/static/img/home/features/headset.png").default,
    title: "Voice chat and social built into Rune",
    description: [
      "The Rune app has friends, messaging, spectating and voice chat.",
      "Rune turns your game into an incredible multiplayer experience!",
    ],
  },
]

const scrollDuration = 600

function Phone({ videoSequence }) {
  const [cursor, setCursor] = useState(0)

  const currentVideoIndex = cursor % videoSequence.length
  const nextVideoIndex = (cursor + 1) % videoSequence.length

  const currentVideo = videoSequence[currentVideoIndex]
  const nextVideo = videoSequence[nextVideoIndex]

  const currentVideoRef = useRef()
  const nextVideoRef = useRef()

  const [videoOffset, setVideoOffset] = useState(0)

  const scrollToNextVideo = useCallback(() => {
    nextVideoRef.current.currentTime = 0
    nextVideoRef.current.play()
    setVideoOffset(-100)

    setTimeout(() => {
      setVideoOffset(0)
      setCursor(cursor + 1)
    }, scrollDuration)
  }, [cursor])

  const scrollToNextVideoRef = useRef(scrollToNextVideo)
  scrollToNextVideoRef.current = scrollToNextVideo

  return (
    <>
      <div className={styles.gameInfo}>
        <div className={styles.author}>
          {currentVideo.game.developers.map(({ avatar }) => (
            <img key={avatar} alt="avatar" src={avatar} />
          ))}
          <span>
            {currentVideo.game.developers.map((d) => d.name).join(" & ")}
          </span>
        </div>
        <div className={styles.game}>
          <span>{currentVideo.game.title}</span>
          <div className={styles.info}>
            <img
              src={
                require("!!url-loader!@site/static/img/home/players.svg")
                  .default
              }
            />
            <span>
              {currentVideo.game.minPlayers === currentVideo.game.maxPlayers
                ? currentVideo.game.minPlayers
                : `${currentVideo.game.minPlayers}-${currentVideo.game.maxPlayers}`}
            </span>
          </div>
        </div>
      </div>
      <div className={styles.phoneFrame}>
        <div className={styles.containerOuter}>
          <div
            className={styles.container}
            style={{
              transition:
                videoOffset === 0 ? "" : `top ${scrollDuration}ms ease-in`,
              top: `${videoOffset}%`,
            }}
          >
            <video
              key={currentVideoIndex}
              ref={currentVideoRef}
              poster={currentVideo.poster}
              muted
              playsInline
              onEnded={scrollToNextVideo}
              autoPlay
            >
              {currentVideo.sources.map((source, idx) => (
                <source key={idx} src={source.src} type={source.type} />
              ))}
            </video>
            <video
              key={nextVideoIndex}
              ref={nextVideoRef}
              poster={nextVideo.poster}
              muted
              playsInline
            >
              {nextVideo.sources.map((source, idx) => (
                <source key={idx} src={source.src} type={source.type} />
              ))}
            </video>
          </div>
        </div>
      </div>
    </>
  )
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext()
  const [selectedFile, setSelectedFile] = useState("logic")

  return (
    <Layout description={siteConfig.description} homeBackground>
      <div className={styles.home}>
        <div className={styles.content}>
          <div className={styles.hero1}>
            <Phone videoSequence={gameVideoSequences.main} />

            <h2>build a multiplayer game played by millions</h2>
            <p>
              Your game runs inside the Rune app with 10 million installs across
              iOS and Android.
            </p>
            <div className={styles.ctaButtons}>
              <Link className={styles.ctaButton} to="/docs/quick-start">
                Get Started
              </Link>
              <a
                className={clsx(styles.ctaButton, styles.blue)}
                href="https://discord.gg/rune-devs"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  alt="Discord Logo"
                  src={require("@site/static/img/home/discord.png").default}
                />
                <span>Join Discord</span>
              </a>
            </div>
          </div>

          <div className={styles.hero2}>
            <h3>you focus on your game, we handle everything&nbsp;else</h3>
            <div className={styles.featuresOuter}>
              <div className={styles.features}>
                {features.map(({ icon, title, description }, idx) => (
                  <div key={idx} className={styles.feature}>
                    <img alt={title} className={styles.icon} src={icon} />
                    <div className={styles.main}>
                      <h5>{title}</h5>
                      {description.map((line, idx2) => (
                        <p key={idx2}>{line}</p>
                      ))}
                    </div>
                    <div className={styles.mainMobile}>
                      <h5>{title}</h5>
                      <p>{description.join(" ")}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.hero3}>
            <h3>no backend needed</h3>
            <HomeGameDemo />
            <p className={styles.description}>
              You write your game logic in JavaScript and Rune runs it on
              servers all over the world for low latency. Our predict-rollback
              approach removes the need for any game networking code and ensures
              that players have an amazing experience even on bad internet.
            </p>
          </div>

          <div className={styles.hero4}>
            <h3>multiplayer in 100 lines&nbsp;of&nbsp;JS</h3>
            <p>
              Here’s the code for the Tic Tac Toe game above. The game has
              built-in voice chat, matchmaking, and spectating. All powered by
              Rune!
            </p>
            <div className={styles.codeContainer}>
              <div className={styles.buttons}>
                <div
                  className={clsx(styles.button, {
                    [styles.active]: selectedFile === "logic",
                  })}
                  onClick={() => setSelectedFile("logic")}
                >
                  logic.js
                </div>
                <div
                  className={clsx(styles.button, {
                    [styles.active]: selectedFile === "client",
                  })}
                  onClick={() => setSelectedFile("client")}
                >
                  client.js
                </div>
              </div>
              <CodeBlock language="js" showLineNumbers>
                {selectedFile === "logic" ? demoCode.logic : demoCode.client}
              </CodeBlock>
            </div>
          </div>

          <div className={styles.makeAnyKindOfGame}>
            <h3>make any kind of game</h3>
            <p>
              Rune has built-in real-time multiplayer and lets you use the
              flexibility of JS + WASM. You can make games with fun physics,
              stunning graphics, and complex game logic. Here’s a few of the
              many games live on Rune.
            </p>

            <ul>
              <li>
                <Phone videoSequence={gameVideoSequences.realTime} />
                <span className={styles.title}>Real-Time</span>
              </li>
              <li>
                <Phone videoSequence={gameVideoSequences.physics} />
                <span className={styles.title}>Physics</span>
              </li>
              <li>
                <Phone videoSequence={gameVideoSequences.graphics} />
                <span className={styles.title}>Graphics</span>
              </li>
            </ul>
          </div>

          <div className={styles.cta}>
            <h3>use your favorite web framework</h3>
            <Link className={styles.ctaButton} to="/docs/quick-start">
              Get Started
            </Link>
            <div className={styles.starsContainer}>
              <Player
                autoplay
                loop
                speed={0.25}
                src={require("@site/static/img/home/starsLottie.json")}
                className={styles.stars}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

Phone.propTypes = {
  videoSequence: PropTypes.array.isRequired,
}
