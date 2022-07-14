import styles from './sub-header.module.css'
import { useRef, useEffect, useState } from 'react'
import { Utilities } from '../../../assets'

const SubHeader = ({
  pageTitle,
  children,
  editable = false,
  additionalClass = '',
  PreComponent = null,
  onAltEditionClick = () => { }
}) => {
  const [top, setTop] = useState(112 - 0.5)

  const onChangeWidth = () => {
    const headerTop = (document.getElementById('main-header')?.offsetHeight || 112) - 0.5
    setTop(headerTop)
  }

  useEffect(()=>{
    onChangeWidth()

    window.addEventListener('resize', onChangeWidth);

    return () => window.removeEventListener("resize", onChangeWidth);
  },[])

  return (
    <section className={`${styles.container} ${additionalClass}`} style={{top: top}}>
      {PreComponent &&
        <PreComponent />
      }
      <div className={styles['header-wrapper']}>
        <h1>
          <span>{pageTitle}</span>
        </h1>
        {editable &&
          <img onClick={onAltEditionClick} className={styles.edit} src={Utilities.editWhite} />
        }
      </div>
      {children}
    </section>
  )
}

export default SubHeader
