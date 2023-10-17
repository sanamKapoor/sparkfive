import  React from 'react'
import styles from './badge.module.css'

function Badge({value}) {
  return (
    <>
    <div className={styles.badge}>
        <span>{value}</span>

    </div>
    </>
  )
}

export default Badge