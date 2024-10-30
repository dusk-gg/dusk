import React, { useState } from "react"
import clsx from "clsx"
import { blogPostContainerID } from "@docusaurus/utils-common"
import { useBlogPost } from "@docusaurus/theme-common/internal"
import MDXContent from "@theme/MDXContent"
import styles from "./styles.module.css"

async function subscribe(email) {
  const response = await fetch("https://substackapi.com/api/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      domain: "runedevs.substack.com",
    }),
  })
  const json = await response.json()
  if (json.errors?.length > 0) {
    return json.errors[0].msg
  }
}

const READY = 1
const WORKING = 2
const DONE = 3
const ERROR = 4

export default function BlogPostItemContent({ children, className }) {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState(READY)
  const [error, setError] = useState(undefined)

  const { isBlogPostPage } = useBlogPost()
  return (
    <div
      // This ID is used for the feed generation to locate the main content
      id={isBlogPostPage ? blogPostContainerID : undefined}
      className={clsx("markdown", className)}
      itemProp="articleBody"
    >
      <MDXContent>{children}</MDXContent>
      <div style={{ width: "100%", textAlign: "center", display: "none" }}>
        Subscribe to our newsletter for more game dev blog posts
      </div>

      <div className={styles.emailWidget}>
        {status === WORKING && (
          <div className={styles.progressHolder}>
            <div className={styles.progress}>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        )}
        {status === DONE && (
          <div className={styles.thankyou}>
            <div className={styles.thankyouHeading}>
              Thanks for subscribing!
            </div>
            <div className={styles.thankyouBody}>
              Keep an eye out for our next <b>Rune Developer Update</b> from
              Substack in your inbox.
            </div>
          </div>
        )}
        {(status === READY || status === ERROR) && (
          <div>
            <div className={styles.sideBarWrap}>
              <div className={styles.emailWrapper}>
                <input
                  type="email"
                  name="email"
                  placeholder="Type your email..."
                  onChange={(e) => {
                    setEmail(e.target.value)
                  }}
                  className={styles.emailInput}
                />
              </div>
              <button
                type="submit"
                className={styles.subscribeButton}
                tabindex="0"
              >
                <span
                  onClick={async () => {
                    setStatus(WORKING)
                    setError(undefined)
                    const error = await subscribe(email)
                    if (error) {
                      setStatus(ERROR)
                      setError(error)
                    } else {
                      setStatus(DONE)
                    }
                  }}
                >
                  Subscribe
                </span>
              </button>
            </div>
            <div className={styles.subtext}>
              <div className={styles.substack}>
                We'll share your email with Substack
                <div className={styles.tooltip}>
                  &#9432;
                  <span className={styles.tooltiptext}>
                    Substack's embed form isn't very pretty, so we made our own.
                    But we need to let you know we'll subscribe you on your
                    behalf. Thanks in advance!
                  </span>
                </div>
                {error && <div className={styles.error}>{error}</div>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
