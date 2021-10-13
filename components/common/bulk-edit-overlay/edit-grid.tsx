import styles from './edit-grid.module.css'
import { Utilities } from '../../../assets'
import ReactTooltip from 'react-tooltip'

// Components
import AssetImg from '../asset/asset-img'
import AssetVideo from '../asset/asset-video'
import AssetApplication from '../asset/asset-application'
import AssetText from '../asset/asset-text'
import IconClickable from '../buttons/icon-clickable'
import AssetIcon from '../asset/asset-icon'

const EditGrid = ({ assets, toggleSelectedEdit }) => (
  <div className={styles['list-wrapper']}>
    <ul className={`${styles['grid-list']}`}>
      {assets.map(({ asset, thumbailUrl, realUrl, isEditSelected }, index) => (
        <li key={asset.id || index}>
          <>
            <div className={`${styles.container}`}>
              <div className={styles['image-wrapper']} onClick={() => toggleSelectedEdit(asset.id)}>
                {thumbailUrl ? (
                  <AssetImg assetImg={thumbailUrl} type={asset.type} name={asset.name} />
                ) : (
                  <AssetIcon extension={asset.extension} bulkSize={true} />
                )}
                {/* {asset.type === 'image' && <AssetImg assetImg={thumbailUrl} type={asset.type} name={asset.name} />}
                {asset.type === 'video' && <AssetVideo asset={asset} realUrl={realUrl} additionalClass={styles['video-wrapper']} bulkSize={true} />}
                {asset.type === 'application' && <AssetApplication extension={asset.extension} bulkSize={true} />}
                {asset.type === 'text' && <AssetText extension={asset.extension} bulkSize={true} />} */}
                <>
                  <div className={`${styles['selectable-wrapper']} ${isEditSelected && styles['selected-wrapper']}`}>
                    <IconClickable src={isEditSelected ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal} additionalClass={styles['select-icon']} />
                  </div>
                </>
              </div>
            </div>
            <div data-tip data-for={`asset-${asset.id}`} className={styles['text-wrapper']}>
              {asset.name}
            </div>
            <ReactTooltip id={`asset-${asset.id}`} delayShow={300} effect='solid'>{asset.name}</ReactTooltip>
          </>
        </li>
      ))}
    </ul>
  </div>
)

export default EditGrid