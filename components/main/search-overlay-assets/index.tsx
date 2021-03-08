import { useState, useContext, useEffect } from 'react'
import { AssetContext } from '../../../context'
import styles from './index.module.css'
import assetApi from '../../../server-api/asset'
import shareCollectionApi from '../../../server-api/share-collection'
import { Waypoint } from 'react-waypoint'
import update from 'immutability-helper'

// Components
import Search from '../../common/inputs/search'
import SearchItem from './search-item'
import Button from '../../common/buttons/button'
import AssetHeaderOps from '../../common/asset/asset-header-ops'

const SearchOverlayAssets = ({ closeOverlay, importEnabled = false, operationsEnabled = false, importAssets = () => { }, sharePath = '' }) => {

  const { assets, setAssets, setActiveOperation, setOperationAsset, setPlaceHolders, nextPage } = useContext(AssetContext)
  const [term, setTerm] = useState('')

  const getData = async (inputTerm, replace = true) => {
    setTerm(inputTerm)
    try {
      let fetchFn = assetApi.getAssets
      if (sharePath) fetchFn = shareCollectionApi.getAssets
      setPlaceHolders('asset', replace)
      const { data } = await fetchFn({ term: inputTerm, page: replace ? 1 : nextPage, sharePath })
      setAssets(data, replace)
    } catch (err) {
      // TODO: Handle this error
      console.log(err)
    }
  }

  useEffect(() => {
    setAssets([])
  }, [])

  const beginAssetOperation = (asset, operation) => {
    setOperationAsset(asset)
    setActiveOperation(operation)
  }

  const toggleSelected = (id) => {
    const assetIndex = assets.findIndex(assetItem => assetItem.asset.id === id)
    setAssets(update(assets, {
      [assetIndex]: {
        isSelected: { $set: !assets[assetIndex].isSelected }
      }
    }))
  }

  const selectAll = () => {
    setAssets(assets.map(assetItem => ({ ...assetItem, isSelected: true })))
  }

  const deselectAll = () => {
    setAssets(assets.map(asset => ({ ...asset, isSelected: false })))
  }

  const selectedAssets = assets.filter(asset => asset.isSelected)

  return (
    <div className={`app-overlay search-container`}>
      <div className={'search-top'}>
        <div className={'search-close'} onClick={closeOverlay}>
          <span className={'search-x'}>X</span>
          <span>esc</span>
        </div>
      </div>
      <div className={'search-content'}>
        <h2 >
          {`Search ${importEnabled ? 'and Import ' : ''}Assets`}
        </h2>
        <div className={'search-cont'}>
          <Search
            placeholder={'Find Assets by Name, Extension, Collection, Campaign, Channel, Tag (min 3 characters)'}
            onSubmit={(inputTerm) => getData(inputTerm)}
          />
        </div>
        <div className={styles.operations}>
          <Button type='button' text='Select All' styleType='secondary' onClick={selectAll} />
          {selectedAssets.length > 0 && <Button text={`Deselect All (${selectedAssets.length})`} type='button' styleType='primary' onClick={deselectAll} />}
          {selectedAssets.length > 0 && <AssetHeaderOps deselectHidden={true} buttonStyleType={'tertiary-blue'} />}
        </div>
        {importEnabled &&
          <div className={styles['import-wrapper']}>
            <Button
              text='Import Assets'
              type='button'
              disabled={selectedAssets.length === 0}
              onClick={importAssets}
              styleType='primary'
            />
          </div>
        }
        <ul className={'search-content-list'}>
          {assets.map((assetItem, index) => (
            <SearchItem
              isShare={sharePath}
              key={index}
              enabledSelect={importEnabled || operationsEnabled}
              toggleSelected={() => toggleSelected(assetItem.asset.id)}
              assetItem={assetItem}
              term={term}
              openShareAsset={() => beginAssetOperation(assetItem, 'share')}
              openDeleteAsset={() => beginAssetOperation(assetItem, 'delete')}
            />
          ))}
        </ul>
        {assets.length > 0 && nextPage !== -1 &&
          <>
            {nextPage > 2 ?
              <>
                {!assets[assets.length - 1].isLoading &&
                  <Waypoint onEnter={() => getData(term, false)} fireOnRapidScroll={false} />
                }
              </>

              :
              <>
                {!assets[assets.length - 1].isLoading &&
                  <div className={styles['button-wrapper']}>
                    <Button
                      text='Load More'
                      type='button'
                      styleType='primary'
                      onClick={() => getData(term, false)} />
                  </div>
                }
              </>
            }
          </>
        }
      </div>
    </div >
  )
}

export default SearchOverlayAssets
