import styles from './asset-text.module.css'
import { Assets } from '../../../assets'

const { html, unknown } = Assets
const AssetText = ({ assetImg, extension, onList = false, bulkSize = false, onClick }) => {
  return (
    <>
      {extension === 'html' ? (
        <div onClick={onClick} className={`${styles.container} ${onList && styles.small} ${bulkSize && styles['bulk-size']}`}>
          <img src={assetImg || html} className={styles.icon} />
        </div>
      ) : (
          <div  className={styles.container}>
            <img onClick={onClick} src={assetImg || unknown} className={styles.icon} />
          </div>
        )}
    </>
  )
}

export default AssetText
