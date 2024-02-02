import Link from "next/link";
import { useState } from "react";
import styles from "./header-link.module.css";
import React from "react";

const HeaderLink = ({ img, imgHover, href, text, active = false }) => {
  const [srcimg, setSrcimg] = useState(imgHover);

  return (
    <Link href={href}>
      <div>
      <a className={styles.ref}>
        <li
          className={`${styles.link} ${active && styles.active}`}
          onMouseOver={() => setSrcimg(imgHover)}
          onMouseOut={() => setSrcimg(img)}
        >
          <img className={styles.icon} src={srcimg} />
          <div className={styles.text}>{text}</div>
        </li>
      </a>
      <a className={styles.ref}>
        <li
          className={`${styles.link} ${active && styles.active}`}
          onMouseOver={() => setSrcimg(imgHover)}
          onMouseOut={() => setSrcimg(img)}
        >
          <img className={styles.icon} src={srcimg} />
          <div className={styles.text}>{text}</div>
        </li>
      </a>

      </div>
     
    </Link>
  );
};

export default HeaderLink;
