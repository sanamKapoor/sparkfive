import styles from './top-bar.module.css'
import {useContext, useRef} from 'react'
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
  deletedAssets
}) => {

  const {
    selectedAllAssets,
    selectAllAssets
  } = useContext(AssetContext)

  const {hasPermission} = useContext(UserContext)

  const setSortFilterValue = (key, value) => {
    // Reset select all status
    selectAllAssets(false);

    setActiveSortFilter({
      ...activeSortFilter,
      [key]: value
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
  return (
    <section className={styles.container}>
      {!deletedAssets ? <div className={styles.filters} >
        <img src={Utilities.search} onClick={setActiveSearchOverlay} className={styles.search} />
        {selectOptions.views.map(view => (
          <>
            {(!activeFolder || !view.omitFolder) && (!isShare || (isShare && !view.omitShare)) &&
            (view.requirePermissions.length === 0 || (view.requirePermissions.length > 0 && hasPermission(view.requirePermissions))) &&
              <SectionButton
                key={view.name}
                text={view.text}
                active={activeSortFilter.mainFilter === view.name}
                onClick={() => setSortFilterValue('mainFilter', view.name)}
              />
            }
          </>
        ))}
      </div> :
        <div className={styles.filters}>
          <h2>Deleted Assets</h2>
          <div></div>
          <span className={styles['content']}>Deleted assets are retained for 60 days before permanent removal. Admin can recover deleted assets within 60 days</span>
        </div>}
      <IconClickable src={Utilities.filter} additionalClass={styles.filter} onClick={toggleHamurgerList} />

      <div className={styles['sec-filters']} ref={filtersRef}>
        {selectedAllAssets && <span className={styles['select-only-shown-items-text']} onClick={toggleSelectAll}>Select only 25 assets shown</span>}
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
        {activeSortFilter.mainFilter !== 'folders' &&
          <div className={styles['sort-wrapper']}>
            <Select
              options={selectOptions.sort}
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
