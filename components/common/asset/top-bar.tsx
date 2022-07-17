import styles from './top-bar.module.css'
import {useContext, useState, useRef, useEffect} from 'react'
import { Utilities } from '../../../assets'
import selectOptions from '../../../utils/select-options'

// Components
import SectionButton from '../buttons/section-button'
import Select from '../inputs/select'
import Button from '../buttons/button'
import IconClickable from '../buttons/icon-clickable'

// Context
import { AssetContext, UserContext } from '../../../context'

const TopBar = ({
  activeSortFilter,
  setActiveSearchOverlay,
  setActiveSortFilter,
  setActiveView,
  selectAll,
  activeFolder = '',
  setOpenFilter,
  openFilter,
  isShare = false,
  deletedAssets,
  singleCollection = false,
  sharedAdvanceConfig
}) => {

  const {
    selectedAllAssets,
    selectAllAssets,
    selectAllFolders,
    selectedAllFolders,
    setLastUploadedFolder
  } = useContext(AssetContext)

  const {user, hasPermission, advancedConfig, setAdvancedConfig} = useContext(UserContext)
  const [hideFilterElements, setHideFilterElements] = useState(advancedConfig.hideFilterElements)

  const [top, setTop] = useState(112 + 83 - 0.5)

  const onChangeWidth = () => {
    const headerTop = (document.getElementById('main-header')?.offsetHeight || 112) - 0.5
    const subHeader = (document.getElementById('sub-header')?.offsetHeight || 83) - 0.5
    setTop(headerTop+subHeader)
  }

  useEffect(()=>{
    onChangeWidth()

    window.addEventListener('resize', onChangeWidth);

    return () => window.removeEventListener("resize", onChangeWidth);
  },[])

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

  const handleOpenFilter = () => {
    toggleHamurgerList()
    if (openFilter) {
      setOpenFilter(false)
    } else {
      setOpenFilter(true)
    }
  }

  const filtersRef = useRef(null)

  const toggleHamurgerList = () => {
    const classType = `visible-flex`
    const { current } = filtersRef
    if (current?.classList.contains(classType)) current.classList.remove(classType)
    else current.classList.add(classType)
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
    <section className={styles.container} style={{top}}>
      {!deletedAssets ? <div className={styles.filters} >
        <img src={Utilities.search} onClick={setActiveSearchOverlay} className={styles.search} />
        <ul className={styles['tab-list']}>
        {tabs.map(view => (
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
      <IconClickable src={Utilities.filter} additionalClass={styles.filter} onClick={toggleHamurgerList} />

      <div className={styles['sec-filters']} ref={filtersRef}>
        {selectedAllAssets && <span className={styles['select-only-shown-items-text']} onClick={toggleSelectAll}>Select only 25 assets shown</span>}
        {selectedAllFolders && <span className={styles['select-only-shown-items-text']} onClick={toggleSelectAll}>Select only 25 collections shown</span>}
        <Button type='button' text='Select All' styleType='secondary' onClick={selectAll} />
        {!deletedAssets && <img src={Utilities.gridView} onClick={() => setActiveView('grid')} />}
        <img src={Utilities.listView} onClick={() => setActiveView('list')} />
        {!deletedAssets && <div className={styles['nested-wrapper']}>
          <Button
            text='Filters'
            type='button'
            styleType='secondary'
            onClick={() => {
              handleOpenFilter()
            }} />
        </div>}
        {
          <div className={styles['sort-wrapper']}>
            <Select
              options={selectOptions.sort.filter(item => {
                return activeSortFilter.mainFilter === 'folders' && item.value==='none' ? !item : item
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
