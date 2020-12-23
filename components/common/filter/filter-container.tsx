import styles from './filter-container.module.css'
import update from 'immutability-helper'
import { FilterContext } from '../../../context'
import { useState, useEffect, useContext } from 'react'
import { Utilities } from '../../../assets'

// Components
import FilterSelector from './filter-selector'
import DateUploaded from './date-uploaded'
import ProductFilter from './product-filter'
import DimensionsFilter from './dimensions-filter'


const FilterContainer = ({ openFilter, setOpenFilter, activeSortFilter, setActiveSortFilter, clearFilters }) => {

    const [expandedMenus, setExpandedMenus] = useState(['tags', 'channels', 'campaigns'])
    const [stickyMenuScroll, setStickyMenuScroll] = useState(false)

    const {
        campaigns,
        channels,
        fileTypes,
        projects,
        tags,
        assetOrientations,
        assetDimensionLimits: {
            maxHeight,
            minHeight,
            maxWidth,
            minWidth
        },
        loadAll
    } = useContext(FilterContext)

    useEffect(() => {
        window.addEventListener("scroll", () => {
            setStickyMenuScroll(window.scrollY > 233)
        })
        loadAll()
    }, [])

    const handleOpenFilter = () => {
        if (openFilter) {
            setOpenFilter(false)
        } else {
            setOpenFilter(true)
        }
    }

    const setSortFilterValue = (key, value) => {
        setActiveSortFilter({
            ...activeSortFilter,
            [key]: value
        })
    }

    const handleExpand = (menu) => {
        let index = expandedMenus.findIndex((item) => item === menu)
        if (index !== -1) {
            setExpandedMenus(update(expandedMenus, {
                $splice: [[index, 1]]
            }))
        } else {
            setExpandedMenus(update(expandedMenus, {
                $push: [menu]
            }))
        }
    }

    return (
        <div className={`${styles.container} ${stickyMenuScroll && styles['sticky-menu']}`}>
            <section className={styles['top-bar']}>
                <h3>Filters</h3>
                <p className={`${styles['clear-container']}`}
                    onClick={clearFilters}>Clear</p>
                <div className={`${styles['close-container']}`}
                    onClick={() => { handleOpenFilter() }}>&#10005;</div>
            </section>
            <div className={styles['section-container']}>
                <section>
                    <div className={styles['expand-bar']} onClick={() => handleExpand('tags')}>
                        <h4>Tags</h4>
                        {expandedMenus.includes('tags') ?
                            <img src={Utilities.arrowUpGrey} className={styles['expand-icon']} /> :
                            <img src={Utilities.arrowGrey} className={styles['expand-icon']} />}
                    </div>
                    {expandedMenus.includes('tags') &&
                        <FilterSelector
                            numItems={10}

                            placeholder={'Tags'}
                            filters={tags.map(tag => ({ ...tag, label: tag.name, value: tag.id }))}
                            value={activeSortFilter.filterTags}
                            setValue={(selected) => setSortFilterValue('filterTags', selected)}
                        />}
                </section>
                <section>
                    <div className={styles['expand-bar']} onClick={() => handleExpand('channels')}>
                        <h4>Channels</h4>
                        {expandedMenus.includes('channels') ?
                            <img src={Utilities.arrowUpGrey} className={styles['expand-icon']} /> :
                            <img src={Utilities.arrowGrey} className={styles['expand-icon']} />}
                    </div>
                    {expandedMenus.includes('channels') &&
                        <FilterSelector
                            searchBar={false}
                            numItems={8}
                            placeholder={'Channels'}
                            filters={channels.map(channel => ({ ...channel, label: channel.name, value: channel.name }))}
                            value={activeSortFilter.filterChannels}
                            setValue={(selected) => setSortFilterValue('filterChannels', selected)}
                        />}
                </section>
                <section>
                    <div className={styles['expand-bar']} onClick={() => handleExpand('campaigns')}>
                        <h4>Campaigns</h4>
                        {expandedMenus.includes('campaigns') ?
                            <img src={Utilities.arrowUpGrey} className={styles['expand-icon']} /> :
                            <img src={Utilities.arrowGrey} className={styles['expand-icon']} />}
                    </div>
                    {expandedMenus.includes('campaigns') &&
                        <FilterSelector
                            oneColumn={true}
                            numItems={5}
                            placeholder={'Campaigns'}
                            filters={campaigns.map(campaign => ({ ...campaign, label: campaign.name, value: campaign.id }))}
                            value={activeSortFilter.filterCampaigns}
                            setValue={(selected) => setSortFilterValue('filterCampaigns', selected)}
                        />}
                </section>
                <section>
                    <div className={styles['expand-bar']} onClick={() => handleExpand('projects')}>
                        <h4>Projects</h4>
                        {expandedMenus.includes('projects') ?
                            <img src={Utilities.arrowUpGrey} className={styles['expand-icon']} /> :
                            <img src={Utilities.arrowGrey} className={styles['expand-icon']} />}
                    </div>
                    {expandedMenus.includes('projects') &&
                        <FilterSelector
                            oneColumn={true}
                            numItems={5}
                            placeholder={'Projects'}
                            filters={projects.map(project => ({ ...project, label: project.name, value: project.id }))}
                            value={activeSortFilter.filterProjects}
                            setValue={(selected) => setSortFilterValue('filterProjects', selected)}
                        />}
                </section>
                <section>
                    <div className={styles['expand-bar']} onClick={() => handleExpand('file-types')}>
                        <h4>File Types</h4>
                        {expandedMenus.includes('file-types') ?
                            <img src={Utilities.arrowUpGrey} className={styles['expand-icon']} /> :
                            <img src={Utilities.arrowGrey} className={styles['expand-icon']} />}
                    </div>
                    {expandedMenus.includes('file-types') &&
                        <FilterSelector
                            searchBar={false}
                            numItems={5}
                            placeholder={'File Types'}
                            filters={fileTypes.map(fileType => ({ ...fileType, label: fileType.name, value: fileType.name }))}
                            value={activeSortFilter.filterFileTypes}
                            setValue={(selected) => setSortFilterValue('filterFileTypes', selected)}
                        />}
                </section>
                <section>
                    <div className={styles['expand-bar']} onClick={() => handleExpand('product')}>
                        <h4>Product</h4>
                        {expandedMenus.includes('product') ?
                            <img src={Utilities.arrowUpGrey} className={styles['expand-icon']} /> :
                            <img src={Utilities.arrowGrey} className={styles['expand-icon']} />}
                    </div>
                    {expandedMenus.includes('product') && <ProductFilter />}
                </section>
                <section>
                    <div className={styles['expand-bar']} onClick={() => handleExpand('date')}>
                        <h4>Date Uploaded</h4>
                        {expandedMenus.includes('date') ?
                            <img src={Utilities.arrowUpGrey} className={styles['expand-icon']} /> :
                            <img src={Utilities.arrowGrey} className={styles['expand-icon']} />}
                    </div>
                    {expandedMenus.includes('date') &&
                        <DateUploaded
                            handleBeginDate={(date) => setSortFilterValue('beginDate', date)}
                            handleEndDate={(date) => setSortFilterValue('endDate', date)}
                            beginDate={activeSortFilter.beginDate}
                            endDate={activeSortFilter.endDate}
                        />
                    }
                </section>
                <section>
                    <div className={styles['expand-bar']} onClick={() => handleExpand('orientation')}>
                        <h4>Orientation</h4>
                        {expandedMenus.includes('orientation') ?
                            <img src={Utilities.arrowUpGrey} className={styles['expand-icon']} /> :
                            <img src={Utilities.arrowGrey} className={styles['expand-icon']} />}
                    </div>
                    {expandedMenus.includes('orientation') &&
                        <FilterSelector
                            searchBar={false}
                            numItems={4}
                            placeholder={'Orientation'}
                            filters={assetOrientations.map(orientation => ({ ...orientation, label: orientation.name, value: orientation.name }))}
                            value={activeSortFilter.filterOrientations}
                            setValue={(selected) => setSortFilterValue('filterOrientations', selected)}
                        />}
                </section>
                <section>
                    <div className={styles['expand-bar']} onClick={() => {
                        setSortFilterValue('dimensionsActive', !expandedMenus.includes('dimensions'))
                        handleExpand('dimensions')
                    }}>
                        <h4>Dimensions</h4>
                        {expandedMenus.includes('dimensions') ?
                            <img src={Utilities.arrowUpGrey} className={styles['expand-icon']} /> :
                            <img src={Utilities.arrowGrey} className={styles['expand-icon']} />}
                    </div>
                    {expandedMenus.includes('dimensions') &&
                        <DimensionsFilter
                            heightDimensionLimits={{ min: minHeight, max: maxHeight }}
                            widthdimensionLimits={{ min: minWidth, max: maxWidth }}
                            handleHeight={({ value }) => setSortFilterValue('dimensionHeight', value)}
                            handleWidth={({ value }) => setSortFilterValue('dimensionWidth', value)}
                            valueHeight={activeSortFilter.dimensionHeight || { min: minHeight, max: maxHeight }}
                            valueWidth={activeSortFilter.dimensionWidth || { min: minWidth, max: maxWidth }}
                        />}
                </section>
            </div>
        </div>

    )
}

export default FilterContainer
