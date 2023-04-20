import { useState, useContext, useEffect } from 'react'
import { AssetContext, FilterContext } from '../../../context'
import styles from './index.module.css'
import assetApi from '../../../server-api/asset'
import shareCollectionApi from '../../../server-api/share-collection'
import { Waypoint } from 'react-waypoint'
import update from 'immutability-helper'
import { Utilities } from '../../../assets'

import gridStyle from '../../common/asset/asset-grid.module.css'

// Components
import Search from '../../common/inputs/search'
import SearchItem from './search-item'
import Button from '../../common/buttons/button'
import AssetHeaderOps from '../../common/asset/asset-header-ops'
import AssetThumbail from "../../common/asset/asset-thumbail";

const SearchOverlayAssets = ({ closeOverlay, importEnabled = false, operationsEnabled = false, importAssets = () => { }, sharePath = '', activeFolder = '', onCloseDetailOverlay = (assetData) => {} }) => {

  const { assets, setAssets, setActiveOperation, setOperationAsset, setPlaceHolders, nextPage, selectAllAssets, selectedAllAssets, totalAssets } = useContext(AssetContext)
  const { term, setSearchTerm, setSearchFilterParams } = useContext(FilterContext)

  const [activeView, setActiveView] = useState('list')
  const [filterParams, setFilterParams] = useState({})


  const getData = async (inputTerm, replace = true, _filterParams=filterParams) => {
    setSearchTerm(inputTerm)
    try {
      let fetchFn = assetApi.getAssets
      if (sharePath) {
        fetchFn = shareCollectionApi.getAssets
      }
      setPlaceHolders('asset', replace)
      if (Object.keys(_filterParams).length > 0) {
        setFilterParams(_filterParams)
        setSearchFilterParams(_filterParams);
      }
      const params: any = { term: inputTerm, page: replace ? 1 : nextPage, sharePath, ..._filterParams }
      // search from inside collection
      if (activeFolder) {
        params.folderId = activeFolder
      }
      const { data } = await fetchFn(params)
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
    // Mark select all
    selectAllAssets()

    setAssets(assets.map(assetItem => ({ ...assetItem, isSelected: true })))
  }

  const deselectAll = () => {
    selectAllAssets(false)

    setAssets(assets.map(asset => ({ ...asset, isSelected: false })))
  }

  const selectedAssets = assets.filter(asset => asset.isSelected)

  let totalSelectAssets = selectedAssets.length;

  // Hidden pagination assets are selected
  if (selectedAllAssets) {
    // Get assets is not selected on screen
    const currentUnSelectedAssets = assets.filter(asset => !asset.isSelected)
    totalSelectAssets = totalAssets - currentUnSelectedAssets.length
  }

  const toggleSelectAll = () => {
    selectAllAssets(!selectedAllAssets)
  }

  // Close search modal
  const closeSearchModal = () => {
    // Reset all value
    setSearchTerm("")
    selectAllAssets(false)

    closeOverlay();
  }

  return (
    <div className={`app-overlay search-container`}>
      <div className={'search-top'}>
        <div className={'search-close'} onClick={closeSearchModal}>
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
            placeholder={'Find Assets by Name, Extension, Collection, Campaign, Tag, Custom Fields (min 3 characters)'}
            onSubmit={(inputTerm, filterParams) => getData(inputTerm, true, filterParams)}
          />
        </div>
        <div className={styles.operations}>
          <div className={styles.buttons}>
            <Button type='button' text='Select All' styleType='secondary' onClick={selectAll} />
            {selectedAssets.length > 0 && <Button text={`Deselect All (${totalSelectAssets})`} type='button' styleType='primary' onClick={deselectAll} />}
            {selectedAllAssets && <span className={styles['select-only-shown-items-text']} onClick={toggleSelectAll}>Select only 25 assets shown</span>}
            {selectedAssets.length > 0 && <AssetHeaderOps deselectHidden={true} buttonStyleType={'tertiary-blue'} isSearch={true}/>}

            <img className={styles['view-icon']} src={Utilities.gridView} onClick={() => setActiveView('grid')} />
            <img className={styles['view-icon']} src={Utilities.listView} onClick={() => setActiveView('list')} />
          </div>
        </div>
          {(activeView === "list" && assets.length > 0) &&
            <div  className={styles["list-head"]}>
              <div className={styles.tags}>Tags</div>
              <div className={styles.type}>Type</div>
              <div className={styles.collection}>Collection</div>
            </div>
          }
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
        {activeView === "list" && <ul className={'search-content-list'}>
          {assets.map((assetItem, index) => (
            <SearchItem
              isShare={sharePath}
              key={index.toString()}
              enabledSelect={importEnabled || operationsEnabled}
              toggleSelected={() => toggleSelected(assetItem.asset.id)}
              assetItem={assetItem}
              term={term}
              openShareAsset={() => beginAssetOperation(assetItem, 'share')}
              openDeleteAsset={() => beginAssetOperation(assetItem, 'delete')}
              onCloseDetailOverlay={onCloseDetailOverlay}
            />
          ))}
        </ul>}

        {activeView === "grid" && <div className={`${gridStyle['list-wrapper']} search-content-list`}>
          <ul className={`${gridStyle['grid-list-small']} ${gridStyle['regular']}`}>
            {assets.map((assetItem, index) => {
              return (
                <li className={gridStyle['grid-item']} key={assetItem.asset.id || index}>
                  <AssetThumbail
                    {...assetItem}
                    showAssetOption={true}
                    sharePath={sharePath}
                    isShare={false}
                    type={""}
                    toggleSelected={() => toggleSelected(assetItem.asset.id)}
                    onCloseDetailOverlay={onCloseDetailOverlay}
                  />
                </li>
              )
            })}
          </ul>
        </div>}


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
