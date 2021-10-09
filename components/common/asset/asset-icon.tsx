import styles from './asset-icon.module.css'
import { Assets } from '../../../assets'

const { msword, msexcel, msppt, pdf, html, zip, bak, indd, db, ai, dwg, unknown } = Assets

const extensions = {
    pdf,
    html,
    zip,
    bak,
    db,
    ai,
    dwg,
}

const extensionToType = ext => {
    if(ext === 'doc' || ext === 'docx') return msword
    if(ext === 'ppt' || ext === 'pptx' || ext === 'vnd.ms-powerpoint') return msppt
    if(ext === 'xlsx' || ext === 'vnd.ms-excel') return msexcel
    if(ext === 'indd' || ext === 'indt') return indd
    if(extensions[ext]) return extensions[ext]
    return unknown
}

const AssetIcon = ({ extension, onList = false, bulkSize = false, onClick }) => {
  return (
    <div onClick={onClick} className={`${onList && styles.small} ${bulkSize && styles['bulk-size']}`}>
        <img src={extensionToType(extension) ?? unknown} className={styles.icon} />
    </div>
  )
}

export default AssetIcon
