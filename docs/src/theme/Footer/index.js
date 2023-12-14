import React from "react"
import styles from "./index.module.scss"
import clsx from "clsx"
import Link from "@docusaurus/Link"
import { Social } from "../../components/Social"

function Footer() {
  const footerCopyright = <>© {new Date().getFullYear()} Rune</>

  const footerLinks = (
    <>
      <Link className={styles.link} to="/docs/examples">
        Examples
      </Link>
      <a
        className={styles.link}
        href="https://rune.ai"
        target="_blank"
        rel="noreferrer"
      >
        Get Rune
      </a>
      <a
        className={styles.link}
        href="https://rune.ai/team"
        target="_blank"
        rel="noreferrer"
      >
        About
      </a>
    </>
  )

  return (
    <>
      <div className={styles.footer}>
        <div className={styles.line}>
          <div className={clsx(styles.link, styles.side)}>
            {footerCopyright}
          </div>
          <div className={styles.center}>{footerLinks}</div>
          <div className={clsx(styles.side, styles.social)}>
            <Social />
          </div>
        </div>
      </div>

      <div className={styles.footerMobile}>
        <div className={styles.links}>{footerLinks}</div>
        <div className={styles.social}>
          <Social />
        </div>
        <div className={styles.link}>{footerCopyright}</div>
      </div>
    </>
  )
}
export default React.memo(Footer)
