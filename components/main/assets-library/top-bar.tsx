import styles from './top-bar.module.css'
import { useEffect, useState, useContext, useRef } from 'react'
import { UserContext, TagContext } from '../../../context'
import { Utilities } from '../../../assets'
import selectOptions from './select-options'
import campaignApi from '../../../server-api/campaign'
import { CALENDAR_ACCESS } from '../../../constants/permissions'

// Components
import SectionButton from '../../common/buttons/section-button'
import NestedSelect from '../../common/inputs/nested-select'
import FiltersSelect from '../../common/inputs/filters-select'
import Select from '../../common/inputs/select'
import Button from '../../common/buttons/button'
import IconClickable from '../../common/buttons/icon-clickable'
import { TagsData } from '../../common/inputs/tags-data'

const TopBar = ({
  activeSortFilter,
  setActiveSearchOverlay,
  setActiveSortFilter,
  activeView,
  setActiveView,
  selectAll,
  activeFolder
}) => {

  const [campaignsFilter, setCampaignsFilter] = useState([])

  const {
    getTopTags,
    getTags,
    tags: tagsFilter,
    topTags
  } = useContext(TagContext)

  const { hasPermission } = useContext(UserContext)

  useEffect(() => {
    getCampaignsTagsFilters()
    getTopTags()
    getTags()
  }, [])

  const selectValueMapFn = item => ({
    label: item.name,
    value: item.id
  })

  const getCampaignsTagsFilters = async () => {
    try {
      if (hasPermission([CALENDAR_ACCESS])) {
        const campaingsResponse = await campaignApi.getCampaigns()
        setCampaignsFilter(campaingsResponse.data.map(selectValueMapFn))
      }
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

  const applyFilters = (selectData) => {
    setActiveSortFilter({
      ...activeSortFilter,
      filterTags: selectData[0]
    })
  }

  const onCampaignChange = (selected) => {
    setActiveSortFilter({
      ...activeSortFilter,
      filterCampaigns: selected
    })
  }

  const onChannelChange = (selected) => {
    setActiveSortFilter({
      ...activeSortFilter,
      filterChannels: selected
    })
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
      <div className={styles['row-nested']}>
        <div className={styles['select-wrapper']}>
          <TagsData
            styleType='filter new-filter-schedule'
            topTags={topTags}
          >
            <NestedSelect
              selectList={[
                {
                  options: tagsFilter.map(selectValueMapFn),
                  placeholder: 'Tags',
                  value: activeSortFilter.filterTags
                },

              ]}
              onApplyFilters={applyFilters}
            />
          </TagsData>
        </div>
        {hasPermission([CALENDAR_ACCESS]) &&
          <div className={styles['select-wrapper']}>
            <FiltersSelect
              options={campaignsFilter}
              placeholder='Campaigns'
              isClearable={true}
              styleType='filter filter-schedule'
              value={activeSortFilter.filterCampaigns}
              onChange={onCampaignChange}
            />
          </div>
        }

        {hasPermission([CALENDAR_ACCESS]) &&
          <div className={styles['select-wrapper']}>
            <FiltersSelect
              options={selectOptions.channels}
              placeholder='Channels'
              isClearable={true}
              styleType='filter filter-schedule'
              value={activeSortFilter.filterChannels}
              onChange={onChannelChange}
            />
          </div>
        }

      </div>
      <div className={styles['sec-filters']} ref={filtersRef}>
        {activeSortFilter.mainFilter !== 'folders' && <Button type='button' text='Select All' styleType='secondary' onClick={selectAll} />}
        <img src={Utilities.gridView} onClick={() => setActiveView('grid')} />
        <img src={Utilities.listView} onClick={() => setActiveView('list')} />
        <div className={styles['nested-wrapper']}>
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