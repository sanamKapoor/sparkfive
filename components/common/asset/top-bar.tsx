import styles from './top-bar.module.css'
import { useContext, useState, useRef, useEffect } from 'react'
import { Utilities } from '../../../assets'
import selectOptions from '../../../utils/select-options'
import { isMobile } from 'react-device-detect'

// Components
import SectionButton from '../buttons/section-button'
import Select from '../inputs/select'
import Button from '../buttons/button'
import IconClickable from '../buttons/icon-clickable'
import AssetAddition from '../../common/asset/asset-addition'

// Context
import { AssetContext, UserContext } from '../../../context'

import { ASSET_UPLOAD_NO_APPROVAL, ASSET_UPLOAD_APPROVAL } from '../../../constants/permissions'

const TopBar = ({
  activeSortFilter,
  setActiveSearchOverlay,
  setActiveSortFilter,
  setActiveView,
  selectAll,
  activeFolder = '',
  getFolders,
  setOpenFilter,
  openFilter,
  isShare = false,
  deletedAssets,
  singleCollection = false,
  sharedAdvanceConfig,
  amountSelected = 0,
  mode,
  showAssetAddition = true,

}) => {

  const {
    selectedAllAssets,
    selectAllAssets,
    selectAllFolders,
    selectedAllFolders,
    setLastUploadedFolder
  } = useContext(AssetContext)

  const { user, hasPermission, advancedConfig, setAdvancedConfig } = useContext(UserContext)
  const [hideFilterElements, setHideFilterElements] = useState(advancedConfig.hideFilterElements)
  const [showTabs, setShowTabs] = useState(isMobile ? false : true)

  const [tabs, setTabs] = useState(selectOptions.views)

  const setSortFilterValue = (key, value) => {
    let sort = key === 'sort' ? value : activeSortFilter.sort
    if (key === 'mainFilter') {
      if (value === 'folders') {
        sort = advancedConfig.collectionSortView === 'alphabetical' ? selectOptions.sort[3] : selectOptions.sort[1]
      } else {
        sort = advancedConfig.assetSortView === 'newest' ? selectOptions.sort[1] : selectOptions.sort[3]
      }
    }

    // Reset select all status
    selectAllAssets(false);
    selectAllFolders(false);
    setActiveSortFilter({
      ...activeSortFilter
    })

    // Needed to reset because it is set for collection upload when alphabetical sort active
    // And uploaded folder needed to show at first
    setLastUploadedFolder(undefined)

    setActiveSortFilter({
      ...activeSortFilter,
      [key]: value,
      sort
    })
  }


  const toggleSelectAll = () => {
    selectAllAssets(!selectedAllAssets)
  }

  const setTabsVisibility = () => {
    const filterElements = sharedAdvanceConfig ? sharedAdvanceConfig.hideFilterElements : hideFilterElements
    const _tabs = selectOptions.views.filter(tab => {
      let tabName = tab.text.toLowerCase()
      let shouldShow = true
      if (filterElements && filterElements.hasOwnProperty(tabName)) {
        shouldShow = !filterElements[tabName]
      }
      return shouldShow
    })
    setTabs(_tabs)
  }

  useEffect(() => {
    setTabsVisibility();
  }, [sharedAdvanceConfig])


  return (
    <section className={styles.container}  id={'top-bar'}>

      {!deletedAssets ? <div className={styles.filters} >
        <ul className={styles['tab-list']}>
          {isMobile &&
            <IconClickable src={Utilities.menu} additionalClass={styles.hamburger} onClick={() => setShowTabs(!showTabs)} />
          }

          {tabs.map(view => (
            (showTabs || view.name === "all") &&
            <li key={view.name} className={styles['tab-list-item']}>
              {(!activeFolder || !view.omitFolder) && (!isShare || (isShare && !view.omitShare && view.hideOnSingle !== singleCollection)) &&
                (view.requirePermissions.length === 0 || (view.requirePermissions.length > 0 && hasPermission(view.requirePermissions))) &&
                <SectionButton
                  keyProp={view.name}
                  text={view.text}
                  active={activeSortFilter.mainFilter === view.name}
                  onClick={() => setSortFilterValue('mainFilter', view.name)}
                />
              }
            </li>
          ))}
        </ul>
      </div> :
        <div className={styles.filters}>
          <h2>Deleted Assets</h2>
          <div></div>
          <span className={styles['content']}>Deleted assets are retained for 60 days before permanent removal. Admin can recover deleted assets within 60 days</span>
        </div>}
      {

      }
      <div className={styles['sec-filters']}>
        {!isMobile &&
          <img src={Utilities.search} onClick={setActiveSearchOverlay} className={styles.search} />
        }
        {(amountSelected === 0 || mode === 'folders') && showAssetAddition && hasPermission([ASSET_UPLOAD_NO_APPROVAL, ASSET_UPLOAD_APPROVAL]) && !isMobile && (
          <AssetAddition activeFolder={activeFolder} getFolders={getFolders} />
        )}
        {selectedAllAssets && <span className={styles['select-only-shown-items-text']} onClick={toggleSelectAll}>Select only 25 assets shown</span>}
        {selectedAllFolders && <span className={styles['select-only-shown-items-text']} onClick={toggleSelectAll}>Select only 25 collections shown</span>}
        {!deletedAssets && <img src={Utilities.gridView} onClick={() => setActiveView('grid')} />}
        <Button type='button' text='Select All' styleType='secondary' onClick={selectAll} />
        {(!deletedAssets && !isMobile) && <div className={styles['nested-wrapper']}>
          <Button
            text='Filters'
            type='button'
            styleType='secondary'
          />
        </div>}
        {
          <div className={styles['sort-wrapper']}>
            <Select
              options={selectOptions.sort.filter(item => {
                return activeSortFilter.mainFilter === 'folders' && item.value === 'none' ? !item : item
              })}
              value={activeSortFilter.sort}
              styleType='filter filter-schedule'
              onChange={(selected) => setSortFilterValue('sort', selected)}
              placeholder='Sort By'
            />
          </div>
        }
      </div>
    </section >
  )
}

export default TopBar
