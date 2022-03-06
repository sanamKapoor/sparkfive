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
    if(ext === 'xlsx' || ext === 'vnd.ms-excel') return msexcel
    if(ext === 'indd' || ext === 'indt') return indd
    if(extensions[ext]) return extensions[ext]
    return canBeEmpty ? empty : unknown
}

const AssetIcon = ({ isDetails = false, extension, onList = false, bulkSize = false, isCollection = false, isSearchList = false, onClick }) => {
  const icon = extensionToType(extension, isCollection);
  return (
    <div onClick={onClick} className={`${styles.container} ${onList ? styles.small : ''} ${bulkSize ? styles['bulk-size'] : ''} ${isCollection ? styles.collection : ''} ${isDetails ? styles.details : ''} ${icon === empty && isCollection ? styles.empty : ''} ${isSearchList ? styles['search-list'] : ''}`}>
        <img src={icon}/>
    </div>
  )
}

export default AssetIcon
