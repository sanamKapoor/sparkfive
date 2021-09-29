import styles from './asset-icon.module.css'
import { Assets } from '../../../assets'

const { msword, msexcel, msppt, pdf, html, zip, bak, unknown } = Assets

const extensions = {
    pdf: pdf,
    html: html,
    zip: zip,
    bak: bak,
}

const extensionToType = ext => {
    if(ext === 'doc' || ext === 'docx') return msword
    if(ext === 'ppt' || ext === 'vnd.ms-powerpoint') return msppt
    if(ext === 'xlsx' || ext === 'vnd.ms-excel') return msexcel
    if(extensions[ext]) return extensions[ext]
    return unknown
}

const AssetIcon = ({ extension, onList = false, bulkSize = false, onClick }) => {
  return (
    <div onClick={onClick} className={`${styles.container} ${onList && styles.small} ${bulkSize && styles['bulk-size']}`}>
        <img src={extensionToType(extension) ?? unknown} className={styles.icon} />
    </div>
  )
}

export default AssetIcon
