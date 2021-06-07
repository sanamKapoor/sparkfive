import styles from './asset-application.module.css'
import { Assets } from '../../../assets'

const { msword, msexcel, msppt, pdf, html, unknown } = Assets
const AssetApplication = ({ extension, onList = false, bulkSize = false, onClick }) => {
  return (
    <>
      {extension === 'pdf' ? (
        <div onClick={onClick} className={`${styles.container} ${onList && styles.small} ${bulkSize && styles['bulk-size']}`}>
          <img src={pdf} className={styles.icon} />
        </div>
      ) : extension === 'doc' ||
        extension ===
          'docx' ? (
            <div onClick={onClick} className={`${styles.container} ${onList && styles.small} ${bulkSize && styles['bulk-size']}`}>
          <img src={msword} className={styles.icon} />
        </div>
      ) : extension ===
          'ppt' ||
        extension === 'vnd.ms-powerpoint' ? (
          <div onClick={onClick} className={`${styles.container} ${onList && styles.small} ${bulkSize && styles['bulk-size']}`}>
          <img src={msppt} className={styles.icon} />
        </div>
      ) : extension === 'vnd.ms-excel' ||
        extension ===
          'xlsx' ? (
            <div onClick={onClick} className={`${styles.container} ${onList && styles.small} ${bulkSize && styles['bulk-size']}`}>
          <img src={msexcel} className={styles.icon} />
        </div>
      ) : extension === 'html' ? (
        <div onClick={onClick} className={`${styles.container} ${onList && styles.small} ${bulkSize && styles['bulk-size']}`}>
          <img src={html} className={styles.icon} />
        </div>
      ) : (
        <div onClick={onClick} className={`${styles.container} ${onList && styles.small} ${bulkSize && styles['bulk-size']}`}>
          <img src={unknown} className={styles.icon} />
        </div>
      )}
    </>
  )
}

export default AssetApplication
