import PropTypes from "prop-types"
import React from "react"
import styles from "./styles.module.css"

export function MultiplayerExamples({ data, techDemo }) {
  const type = techDemo ? "tech-demos" : "examples"

  return (
    <ul className={styles.examples}>
      {data.map((example) => (
        <li key={example.slug}>
          <a href={`/${type}/${example.slug}/`}>
            <img src={example.src} />
          </a>
          <h2>{example.title}</h2>
          <a href={`/${type}/${example.slug}/`}>Demo</a> |{" "}
          <a
            href={`https://github.com/rune/rune/tree/staging/${type}/${example.slug}`}
          >
            Source
          </a>
          {techDemo && !example.skipBlog && (
            <span>
              {" "}
              | <a href={`/blog/${example.slug}/`}>Blog</a>
            </span>
          )}
          <p>{example.description}</p>
        </li>
      ))}
    </ul>
  )
}

MultiplayerExamples.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      src: PropTypes.string.isRequired,
    })
  ).isRequired,
  techDemo: PropTypes.bool,
}
