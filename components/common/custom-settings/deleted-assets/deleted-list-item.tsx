import asset from "../../../../server-api/asset"
import styles from "./deleted-list-item.module.css"
import { Utilities } from '../../../../assets'
import filesize from 'filesize'
import { format } from 'date-fns'
import { useState, useEffect, useContext } from 'react'
import { getParsedExtension } from '../../../../utils/asset'

// Components
import AssetImg from '../../asset/asset-img'
import IconClickable from '../../buttons/icon-clickable'
import DetailOverlay from '../../asset/detail-overlay'
import AssetIcon from "../../asset/asset-icon"
import { AssetOps } from '../../../../assets'

const DEFAULT_DETAIL_PROPS = { visible: false, side: 'detail' }

const DeletedListItem = ({
  isShare,
  type,
  assetItem: {
    asset,
    thumbnailUrl,
    realUrl,
    isUploading,
    isSelected = false,
    isLoading = false
  },
  index,
  sortAttribute,
  toggleSelected = () => { },
  openDeleteAsset = () => { },
  openRecoverAsset = () => { },
  setCurrentSortAttribute = (attribute) => { },
}) => {
  const dateFormat = 'MMM do, yyyy h:mm a'

  const [overlayProperties, setOverlayProperties] = useState(DEFAULT_DETAIL_PROPS)

  useEffect(() => {
    if (overlayProperties.visible) {
      document.body.classList.add('no-overflow')
    } else {
      document.body.classList.remove('no-overflow')
    }

    return () => document.body.classList.remove('no-overflow')
  }, [overlayProperties.visible])

  const getSortAttributeClassName = attribute => sortAttribute.replace('-', '') === attribute && styles['active']
  const setSortAttribute = attribute => {
    if (attribute === sortAttribute) {
      setCurrentSortAttribute('-' + attribute)
    } else {
      setCurrentSortAttribute(sortAttribute.startsWith('-') ? '' : attribute)
    }
  }
  const arrowIcon = sortAttribute.startsWith('-') ? Utilities.arrowUpGrey : Utilities.arrowGrey

  return (
    <>
      <div className={styles.list}>
        {index === 0 &&
          <div className={styles.header}>
            <h4> </h4>
            <div className={styles['headers-content']}>
              <h4 onClick={() => setSortAttribute('asset.name')} >
                Name
                <IconClickable src={arrowIcon} additionalClass={`${styles['sort-icon']} ${getSortAttributeClassName('asset.name')}`} />
              </h4>
              {/*<h4>Stage</h4>*/}
              <h4 onClick={() => setSortAttribute('asset.type')} >
                Type
                <IconClickable src={arrowIcon} additionalClass={`${styles['sort-icon']} ${getSortAttributeClassName('asset.type')}`} />
              </h4>
              <h4 onClick={() => setSortAttribute('asset.extension')} >
                Extension
                <IconClickable src={arrowIcon} additionalClass={`${styles['sort-icon']} ${getSortAttributeClassName('asset.extension')}`} />
              </h4>
              <h4 onClick={() => setSortAttribute('asset.size')} >
                Size
                <IconClickable src={arrowIcon} additionalClass={`${styles['sort-icon']} ${getSortAttributeClassName('asset.size')}`} />
              </h4>
              <h4 onClick={() => setSortAttribute('asset.deleted-at')} >
                Date Deleted
                <IconClickable src={arrowIcon} additionalClass={`${styles['sort-icon']} ${getSortAttributeClassName('asset.deleted-at')}`} />
              </h4>
              <h4></h4>
            </div>
          </div>
        }
        <div className={styles.item}>
          <div className={styles.photo}>
            <div className={`${styles['selectable-wrapper']} ${isSelected && styles['selected-wrapper']}`}>
              {!isLoading &&
                <>
                  {isSelected ?
                    <IconClickable src={Utilities.radioButtonEnabled} additionalClass={styles['select-icon']} onClick={toggleSelected} />
                    :
                    <IconClickable src={Utilities.radioButtonNormal} additionalClass={styles['select-icon']} onClick={toggleSelected} />
                  }
                </>
              }
            </div>
            <div className={`${styles.thumbnail} ${isLoading && 'loadable'}`}>
              {thumbnailUrl ? (
                <AssetImg assetImg={thumbnailUrl} type={asset.type} name={asset.name} />
              ) : (
                <AssetIcon extension={asset.extension} onList={true} onClick={undefined} />
              )}
              </div>
          </div>
          <div className={styles.info}>
            <div className={`${styles.name} ${isLoading && 'loadable'}`}>
              {asset.name}
            </div>
            <div className={`${styles.field_name} ${isLoading && 'loadable'}`}>
              {!isUploading && asset.type}
            </div>
            <div className={styles.field_name}>
              {!isLoading && getParsedExtension(asset.extension)}
            </div>
            <div className={styles.field_name}>
              {asset.size && filesize(asset.size)}
            </div>
            <div className={`${styles.field_name} ${styles.dateHide} ${isLoading && 'loadable'}`}>
              {asset?.deletedAt && format(new Date(asset.deletedAt), dateFormat)}
            </div>
            {!isLoading && !isUploading &&
              <div>
                <span className={styles.span}><IconClickable additionalClass={styles['action-button']} src={AssetOps[`move`]} tooltipText={'Recover'} tooltipId={'Recover'} onClick={openRecoverAsset} /></span>
                <span className={styles.span}><IconClickable additionalClass={styles['action-button']} src={AssetOps[`delete`]} tooltipText={'Delete'} tooltipId={'Delete'} onClick={openDeleteAsset} /></span>
              </div>
            }
          </div>
        </div>
      </div>
    </>
  )
}

export default DeletedListItem
