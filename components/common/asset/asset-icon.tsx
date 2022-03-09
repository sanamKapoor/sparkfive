import styles from './asset-icon.module.css'
import { Assets } from '../../../assets'

const { msword, msexcel, msppt, pdf, html, zip, bak, indd, db, ai, dwg, unknown, empty } = Assets

const extensions = {
    pdf,
    html,
    zip,
    bak,
    db,
    ai,
    dwg,
}

const extensionToType = (ext, canBeEmpty) => {
    if(ext === 'doc' || ext === 'docx') return msword
    if(ext === 'ppt' || ext === 'pptx' || ext === 'vnd.ms-powerpoint') return msppt
    if(ext === 'xlsx' || ext === 'vnd.ms-excel' || ext === 'xls') return msexcel
    if(ext === 'indd' || ext === 'indt') return indd
    if(extensions[ext]) return extensions[ext]
    return canBeEmpty ? empty : unknown
}

const AssetIcon = ({ extension, onList = false, bulkSize = false, isCollection = false, onClick, noMargin = false, padding = false }) => {

  console.log('ext', extension)

  return (
    <div onClick={onClick} className={`${styles.container} ${!noMargin && onList && styles.small} ${noMargin && styles.noMargin} ${bulkSize && styles['bulk-size']} ${isCollection && styles.collection}`}>
        <img className={`${padding && styles.padding}`} src={extensionToType(extension, isCollection)}/>
    </div>
  )
}

export default AssetIcon
