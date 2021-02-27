import styles from './edit-grid.module.css'

// Components
import AssetImg from '../asset/asset-img'
import AssetVideo from '../asset/asset-video'
import AssetApplication from '../asset/asset-application'
import AssetText from '../asset/asset-text'
import IconClickable from '../buttons/icon-clickable'
import Button from '../buttons/button'

const EditGrid = ({ assets }) => (
  <div className={styles['list-wrapper']}>
    <ul className={`${styles['grid-list']}`}>
      {assets.map(({ asset, thumbailUrl, realUrl }, index) => (
        <li key={asset.id || index}>
          <div className={`${styles.container}`}>
            <div className={styles['image-wrapper']}>
              {asset.type === 'image' && <AssetImg assetImg={thumbailUrl} type={asset.type} name={asset.name} />}
              {asset.type === 'video' && <AssetVideo asset={asset} realUrl={realUrl} additionalClass={styles['video-wrapper']} />}
              {asset.type === 'application' && <AssetApplication extension={asset.extension} />}
              {asset.type === 'text' && <AssetText extension={asset.extension} />}
              {/* <>
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
              </> */}
            </div>
          </div>
        </li>
      ))}
    </ul>
  </div>
)

export default EditGrid