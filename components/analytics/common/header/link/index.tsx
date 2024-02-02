import React from 'react'
import styles from "../index.module.css"
import { useRouter } from 'next/router'

const SectionLink = ({ title, link }: { title: string, link: string }) => {
    const router = useRouter();

    const clickHandler = () => {
        router.push(link)
    }

  return (
    <span className={styles.link} onClick={clickHandler}>
      {title}
    </span>
  );
}

export default SectionLink