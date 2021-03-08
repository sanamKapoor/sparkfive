import styles from './search-item.module.css'
import { Utilities } from '../../../assets'
import Router from 'next/router'
import { format } from 'date-fns'
import Highlighter from "react-highlight-words"
import { getAssociatedCampaigns } from '../../../utils/asset'
import { useState } from 'react'
import { getParsedExtension } from '../../../utils/asset'

// Components
import AssetImg from '../../common/asset/asset-img'
import AssetVideo from '../../common/asset/asset-video'
import AssetApplication from '../../common/asset/asset-application'
import AssetText from '../../common/asset/asset-text'
import DetailOverlay from '../../common/asset/detail-overlay'
import IconClickable from '../../common/buttons/icon-clickable'

const SearchItem = ({ assetItem, term, openShareAsset, openDeleteAsset, toggleSelected, enabledSelect = false, isShare }) => {

  const { asset, thumbailUrl, realUrl, isLoading = false, isSelected } = assetItem
  const [visibleOverlay, setVisibleOVerlay] = useState(false)

  return (
    <>
      <li
        className={`search-item ${styles['search-item']}`}>
        {!isLoading && enabledSelect &&
          <>
            {isSelected ?
              <IconClickable src={Utilities.radioButtonEnabled} additionalClass={styles['select-icon']} onClick={toggleSelected} />
              :
              <IconClickable src={Utilities.radioButtonNormal} additionalClass={styles['select-icon']} onClick={toggleSelected} />
            }
          </>
        }
        <div className={`${styles['image-wrapper']} ${isLoading && 'loadable'} ${enabledSelect && styles['image-selectable']}`}>
          {asset.type === 'image' && <AssetImg assetImg={thumbailUrl} type={asset.type} name={asset.name} />}
          {asset.type === 'video' && <AssetVideo asset={asset} realUrl={realUrl} additionalClass={styles['video-wrapper']} />}
          {asset.type === 'application' && <AssetApplication extension={asset.extension} onList={true} />}
          {asset.type === 'text' && <AssetText extension={asset.extension} onList={true} />}
        </div>
        <div className={`${styles.name} ${isLoading && 'loadable'}`} onClick={() => !isLoading ? setVisibleOVerlay(true) : () => { }}>
          <Highlighter
            highlightClassName={'search-highlight'}
            searchWords={[term]}
            autoEscape={true}
            textToHighlight={asset.name}
          />
        </div>
        <div className={styles.campaign}>
          {!isLoading &&
            <Highlighter
              highlightClassName={'search-highlight'}
              searchWords={[term]}
              autoEscape={true}
              textToHighlight={getAssociatedCampaigns(asset)}
            />
          }
        </div>
        <div className={`${styles.extension} ${isLoading && 'loadable'}`}>
          <Highlighter
            highlightClassName={'search-highlight'}
            searchWords={[term]}
            autoEscape={true}
            textToHighlight={getParsedExtension(asset.extension)}
          />
        </div>
        <div className={styles.folder}>
          {!isLoading &&
            <Highlighter
              highlightClassName={'search-highlight'}
              searchWords={[term]}
              autoEscape={true}
              textToHighlight={asset.folder?.name || 'No Collection'}
            />
          }
        </div>
      </li >
      {visibleOverlay &&
        <DetailOverlay
          isShare={isShare}
          initialParams={{}}
          asset={asset}
          realUrl={realUrl}
          openShareAsset={openShareAsset}
          openDeleteAsset={openDeleteAsset}
          closeOverlay={() => setVisibleOVerlay(false)} />
      }
    </>
  )
}

export default SearchItem

