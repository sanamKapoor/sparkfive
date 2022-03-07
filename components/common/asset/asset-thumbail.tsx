import styles from './asset-thumbail.module.css'
import { Utilities, Assets } from '../../../assets'
import { format } from 'date-fns'
import { useState, useEffect } from 'react'

// Components
import AssetImg from './asset-img'
import AssetIcon from './asset-icon'
import AssetVideo from './asset-video'
import AssetApplication from './asset-application'
import AssetText from './asset-text'
import IconClickable from '../buttons/icon-clickable'
import Button from '../buttons/button'
import DetailOverlay from './detail-overlay'
import AssetOptions from './asset-options'

const DEFAULT_DETAIL_PROPS = { visible: false, side: 'detail' }

const AssetThumbail = ({
  isShare,
  sharePath,
  type,
  asset,
  thumbailUrl,
  realUrl,
  isUploading,
  showAssetOption = true,
  isSelected = false,
  isLoading = false,
  toggleSelected = () => { },
  openDeleteAsset = () => { },
  openMoveAsset = () => { },
  openCopyAsset = () => { },
  openShareAsset = () => { },
  openArchiveAsset = () => { },
  downloadAsset = () => { },
  openRemoveAsset = () => { }
}) => {

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

  return (
    <>
      <div className={`${styles.container} ${isLoading && 'loadable'}`}>
        <div className={styles['image-wrapper']}>
          {isUploading &&
            <>
              <p className={styles.uploading}>Uploading...</p>
            </>
          }
          {thumbailUrl ? (
            <AssetImg assetImg={thumbailUrl} type={asset.type} name={asset.name} opaque={isUploading} />
          ) : (
            <AssetIcon extension={asset.extension} />
          )}
          {/* {asset.type === 'image' && <AssetImg assetImg={thumbailUrl} type={asset.type} name={asset.name} opaque={isUploading} />}
          {asset.type === 'video' && <AssetVideo assetImg={thumbailUrl} asset={asset} realUrl={realUrl} additionalClass={styles['video-wrapper']} />}
          {asset.type === 'application' && <AssetApplication assetImg={thumbailUrl} extension={asset.extension} />}
          {asset.type === 'text' && <AssetText assetImg={thumbailUrl} extension={asset.extension} />} */}
          {!isUploading && !isLoading &&
            <>
              <div className={`${styles['selectable-wrapper']} ${isSelected && styles['selected-wrapper']}`}>
                {isSelected ?
                  <IconClickable src={Utilities.radioButtonEnabled} additionalClass={styles['select-icon']} onClick={toggleSelected} />
                  :
                  <IconClickable src={Utilities.radioButtonNormal} additionalClass={styles['select-icon']} onClick={toggleSelected} />
                }
              </div>
              <div className={styles['image-button-wrapper']}>
                <Button styleType={'primary'} text={'View Details'} type={'button'}
                  onClick={() => setOverlayProperties({ ...DEFAULT_DETAIL_PROPS, visible: !overlayProperties.visible })} />
              </div>
            </>
          }
        </div>
        <div className={styles.info}>
          <div className='normal-text'>{asset.name}</div>
          <div className={styles['details-wrapper']}>
            <div className='secondary-text'>{format(new Date(asset.createdAt), 'MMM d, yyyy, p')}</div>
            {!isUploading && showAssetOption &&
              <AssetOptions
                itemType={type}
                asset={asset}
                openArchiveAsset={openArchiveAsset}
                openDeleteAsset={openDeleteAsset}
                openMoveAsset={openMoveAsset}
                openCopyAsset={openCopyAsset}
                downloadAsset={downloadAsset}
                openShareAsset={openShareAsset}
                openComments={openComments}
                openRemoveAsset={openRemoveAsset}
                isShare={isShare}
              />
            }
          </div>
        </div>
      </div>
      {overlayProperties.visible &&
        <DetailOverlay
          sharePath={sharePath}
          isShare={isShare}
          asset={asset}
          realUrl={(asset.extension === 'tiff' || asset.extension === 'tif') ? thumbailUrl : realUrl}
          thumbailUrl={thumbailUrl}
          initiaParams={overlayProperties}
          openShareAsset={openShareAsset}
          openDeleteAsset={openDeleteAsset}
          closeOverlay={() => setOverlayProperties({ ...DEFAULT_DETAIL_PROPS, visible: false })} />
      }
    </>
  )
}

export default AssetThumbail
