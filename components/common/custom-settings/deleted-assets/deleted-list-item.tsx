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
import Button from '../../buttons/button'
import DetailOverlay from '../../asset/detail-overlay'
import AssetOptions from '../../asset/asset-options'
import AssetIcon from "../../asset/asset-icon"
import { AssetContext } from "../../../../context"
import { AssetOps } from '../../../../assets'

const DEFAULT_DETAIL_PROPS = { visible: false, side: 'detail' }

const DeletedListItem = ({
  isShare,
  type,
  assetItem: {
    asset,
    thumbailUrl,
    realUrl,
    isUploading,
    isSelected = false,
    isLoading = false
  },
  index,
  sortAttribute,
  toggleSelected = () => { },
  openDeleteAsset = () => { },
  openRemoveAsset = () => { },
  setCurrentSortAttribute = (attribute) => { },
}) => {

  const { setActiveOperation } = useContext(AssetContext)

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

  const openComments = () => {
    setOverlayProperties({ visible: true, side: 'comments' })
  }

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
              <h4 onClick={() => setSortAttribute('asset.created-at')} >
                Date Deleted
                <IconClickable src={arrowIcon} additionalClass={`${styles['sort-icon']} ${getSortAttributeClassName('asset.created-at')}`} />
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
              {thumbailUrl ? (
                <AssetImg assetImg={thumbailUrl} type={asset.type} name={asset.name} />
              ) : (
                <AssetIcon extension={asset.extension} onList={true} onClick={undefined} />
              )}
              {/* {asset.type === 'image' && <AssetImg assetImg={thumbailUrl} type={asset.type} name={asset.name} />}
              {asset.type === 'video' &&
                <video preload='metadata'>
                  <source src={realUrl}
                    type={`video/${asset.extension}`} />
                </video>
              }
              {asset.type === 'application' && <AssetApplication extension={asset.extension} onList={true} />}
              {asset.type === 'text' && <AssetText extension={asset.extension} onList={true} />} */}
            </div>
          </div>
          <div className={styles.info}>
            <div className={`${styles.name} ${isLoading && 'loadable'}`} onClick={() => setOverlayProperties({ ...DEFAULT_DETAIL_PROPS, visible: !overlayProperties.visible })}>
              {asset.name}
            </div>
            {/*<div className={styles.status}>*/}
            {/*  {isUploading && 'Uplaoding...'}*/}
            {/*  {!isLoading && !isUploading && <StatusBadge status={asset.stage} />}*/}
            {/*</div>*/}
            <div className={`${styles.field_name} ${isLoading && 'loadable'}`}>
              {!isUploading && asset.type}
            </div>
            <div className={styles.field_name}>
              {!isLoading && getParsedExtension(asset.extension)}
            </div>
            <div className={styles.field_name}>
              {asset.size && filesize(asset.size)}
            </div>
            <div className={`${styles.field_name} ${isLoading && 'loadable'}`}>
              {format(new Date(asset.createdAt), dateFormat)}
            </div>
            {!isLoading && !isUploading &&
              <div>
                <span className={styles.span}><IconClickable additionalClass={styles['action-button']} src={AssetOps[`move`]} tooltipText={'Resend'} tooltipId={'Move'} onClick={openDeleteAsset} /></span>
                <span className={styles.span}><IconClickable additionalClass={styles['action-button']} src={AssetOps[`delete`]} tooltipText={'Delete'} tooltipId={'Delete'} onClick={openDeleteAsset} /></span>
              </div>
            }
          </div>
        </div>
      </div>
      {overlayProperties.visible &&
        <DetailOverlay
        isShare={isShare}
        asset={asset}
        realUrl={realUrl}
        initialParams={overlayProperties}
        openShareAsset={openShareAsset}
        openDeleteAsset={openDeleteAsset}
        closeOverlay={() => setOverlayProperties({ ...DEFAULT_DETAIL_PROPS, visible: false })} thumbailUrl={undefined} />
      }
    </>
  )
}

export default DeletedListItem
