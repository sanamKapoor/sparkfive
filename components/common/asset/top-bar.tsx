import styles from './top-bar.module.css'
import { useRef } from 'react'
import { Utilities } from '../../../assets'
import selectOptions from '../select-options'

// Components
import SectionButton from '../buttons/section-button'
import Select from '../inputs/select'
import Button from '../buttons/button'
import IconClickable from '../buttons/icon-clickable'

const TopBar = ({
  activeSortFilter,
  setActiveSearchOverlay,
  setActiveSortFilter,
  setActiveView,
  selectAll,
  activeFolder = '',
  setOpenFilter,
  openFilter,
  isShare = false
}) => {

  const setSortFilterValue = (key, value) => {
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

  return (
    <section className={styles.container}>
      <div className={styles.filters} >
        <img src={Utilities.search} onClick={setActiveSearchOverlay} className={styles.search}/>
        {selectOptions.views.map(view => (
          <>
            {(!activeFolder || !view.omitFolder) && (!isShare || (isShare && !view.omitShare)) &&
              <SectionButton
                key={view.name}
                text={view.text}
                active={activeSortFilter.mainFilter === view.name}
                onClick={() => setSortFilterValue('mainFilter', view.name)}
              />
            }
          </>
        ))}
      </div>
      <IconClickable src={Utilities.filter} additionalClass={styles.filter} onClick={toggleHamurgerList} />

      <div className={styles['sec-filters']} ref={filtersRef}>
        {activeSortFilter.mainFilter !== 'folders' && <Button type='button' text='Select All' styleType='secondary' onClick={selectAll} />}
        <img src={Utilities.gridView} onClick={() => setActiveView('grid')} />
        <img src={Utilities.listView} onClick={() => setActiveView('list')} />
        {activeSortFilter.mainFilter !== 'folders' &&
          <div className={styles['nested-wrapper']}>
            <Button
              text='Filters'
              type='button'
              styleType='secondary'
              onClick={() => {
                handleOpenFilter()
              }} />
          </div>
        }
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