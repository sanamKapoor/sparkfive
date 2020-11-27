import styles from './tags-data.module.css'
import React, { useState } from 'react'

// Components
import ToggleableAbsoluteWrapper from '../../common/misc/toggleable-absolute-wrapper'

export const TagsData = ({ styleType = '', topTags, children }) => {
  const MenuList = props => (
    <>
      <div className={styles['title-most-used']}>Most Used Tags</div>
      <div className={styles['container-data']}>
        {topTags.map((topTag, index) => {
          return (
            <div className={styles['container-data-row']} key={index}>
              <div className={styles['data-top']}>
                <span>{topTag.name}</span>
              </div>
              <div className={styles['number-top']}>
                <span>{topTag.number}</span>
              </div>
            </div>
          )
        })}
      </div>
      {props.children}
    </>

  )
  return (
    <ToggleableAbsoluteWrapper
      ignoreSelect={true}
      closeOnAction={false}
      Wrapper={({ children: contentChildren }) => (
        <>
          <div className={styles['select-list']}>
            <div className={`${styles.container} ${styleType} ${styles[styleType]}`}>
              Tags
            </div>
          </div>
          {contentChildren}
        </>
      )}
      wrapperClass={styles.wrapper}
      contentClass={styles['container-most-used']}
      Content={() => (
        <MenuList>
          {children}
        </MenuList>
      )}
    />
  )
}
