import styles from './asset-application.module.css'
import { Assets } from '../../../assets'

const { msword, msexcel, msppt, pdf, html, unknown } = Assets
const AssetApplication = ({ extension, onList = false }) => {
  return (
    <>
      {extension === 'pdf' ? (
        <div className={`${styles.container} ${onList && styles.small}`}>
          <img src={pdf} className={styles.icon} />
        </div>
      ) : extension === 'doc' ||
        extension ===
          'docx' ? (
            <div className={`${styles.container} ${onList && styles.small}`}>
          <img src={msword} className={styles.icon} />
        </div>
      ) : extension ===
          'ppt' ||
        extension === 'vnd.ms-powerpoint' ? (
          <div className={`${styles.container} ${onList && styles.small}`}>
          <img src={msppt} className={styles.icon} />
        </div>
      ) : extension === 'vnd.ms-excel' ||
        extension ===
          'xlsx' ? (
            <div className={`${styles.container} ${onList && styles.small}`}>
          <img src={msexcel} className={styles.icon} />
        </div>
      ) : extension === 'html' ? (
        <div className={`${styles.container} ${onList && styles.small}`}>
          <img src={html} className={styles.icon} />
        </div>
      ) : (
        <div className={`${styles.container} ${onList && styles.small}`}>
          <img src={unknown} className={styles.icon} />
        </div>
      )}
    </>
  )
}

export default AssetApplication
