import styles from './top-bar.module.css'
import { useEffect, useState, useContext, useRef } from 'react'
import { UserContext } from '../../../context'
import { Utilities } from '../../../assets'
import selectOptions from './select-options'
import campaignApi from '../../../server-api/campaign'
import filterApi from '../../../server-api/filter'
import tagApi from '../../../server-api/tag'
import { CALENDAR_ACCESS } from '../../../constants/permissions'

// Components
import SectionButton from '../../common/buttons/section-button'
import NestedSelect from '../../common/inputs/nested-select'
import Select from '../../common/inputs/select'
import Button from '../../common/buttons/button'
import IconClickable from '../../common/buttons/icon-clickable'

const TopBar = ({
  activeSortFilter,
  setActiveSearchOverlay,
  setActiveSortFilter,
  activeView,
  setActiveView,
  selectAll,
  activeFolder,
  setOpenFilter,
  openFilter
}) => {

  const [campaignsFilter, setCampaignsFilter] = useState([])
  const [tagsFilter, setTagsFilter] = useState([])

  const { hasPermission } = useContext(UserContext)
  useEffect(() => {
    getCampaignsTagsFilters()
  }, [])

  const getCampaignsTagsFilters = async () => {
    try {
      const selectValueMapFn = item => ({
        label: item.name,
        value: item.id
      })
      if (hasPermission([CALENDAR_ACCESS])) {
        const campaingsResponse = await campaignApi.getCampaigns({ assetsCount: 'yes' })
        setCampaignsFilter(campaingsResponse.data.map(selectValueMapFn))
      }
      const tagsResponse = await tagApi.getTags()
      setTagsFilter(tagsResponse.data.map(selectValueMapFn))
    } catch (err) {
      console.log(err)
      // Handle this error
    }
  }

  const setSortFilterValue = (key, value) => {
    setActiveSortFilter({
      ...activeSortFilter,
      [key]: value
    })
  }

  const handleOpenFilter = () => {
    toggleHamurgerList()
    if(openFilter) {
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
        <img src={Utilities.search} onClick={setActiveSearchOverlay} />
        {selectOptions.views.map(view => (
          <>
            {(!activeFolder || !view.ommitFolder) &&
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
        <div className={styles['nested-wrapper']}>
          <Button
            text='Filters'
            type='button'
            styleType='secondary'
            onClick={() => {
              handleOpenFilter()
            }} />
        </div>
        <div className={styles['sort-wrapper']}>
          <Select
            options={selectOptions.sort}
            value={activeSortFilter.sort}
            styleType='filter filter-schedule'
            onChange={(selected) => setSortFilterValue('sort', selected)}
            placeholder='Sort By'
          />
        </div>
      </div>
    </section >
  )
}

export default TopBar