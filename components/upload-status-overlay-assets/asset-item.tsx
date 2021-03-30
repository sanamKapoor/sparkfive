import styles from './asset-item.module.css'
import { Utilities } from '../../assets'
import clsx from "clsx"

import { getTypeFromMimeType, formatBytes } from '../../utils/upload'

// Components
import IconClickable from '../common/buttons/icon-clickable'
import Button from '../common/buttons/button'

const AssetItem = ({ assetItem, toggleSelected, onRetry }) => {

  const { isSelected, asset, error } = assetItem

  return (
      <li
          className={`search-item ${styles['search-item']}`}>
          <div className={`${styles['select-wrapper']}`}>
              {isSelected ?
                  <IconClickable src={Utilities.radioButtonEnabled} additionalClass={styles['select-icon']} onClick={toggleSelected} />
                  :
                  <IconClickable src={Utilities.radioButtonNormal} additionalClass={styles['select-icon']} onClick={toggleSelected} />
              }
          </div>
        <div className={`${styles.name}`}>
            {asset.name}
        </div>
        <div className={styles.type}>
            {getTypeFromMimeType(asset.mimeType)}
        </div>
        <div className={styles.type}>
            {formatBytes(asset.size)}
        </div>
        <div className={`${styles['upload-error']}`}>
            {error}
            {!error && <span className={`${styles['no-error']}`}>No Error</span>}
        </div>
        <div>
            <Button onClick={onRetry} className={clsx({[styles['hidden']]: !error})} type='button' text='Retry' styleType='primary'/>
        </div>
      </li >
  )
}

export default AssetItem

