import styles from './filter-container.module.css'
import update from 'immutability-helper'
import { FilterContext } from '../../../context'
import { useState, useEffect, useContext } from 'react'
import { Utilities } from '../../../assets'

import customFieldsApi from '../../../server-api/attribute'

// Components
import FilterSelector from './filter-selector'
import DateUploaded from './date-uploaded'
import ProductFilter from './product-filter'
import DimensionsFilter from './dimensions-filter'


const FilterContainer = ({ openFilter, setOpenFilter, activeSortFilter, setActiveSortFilter, clearFilters, isFolder = false }) => {

    const [expandedMenus, setExpandedMenus] = useState(isFolder ? ['folders'] : ['tags', 'customFields', 'channels', 'campaigns'])
    const [stickyMenuScroll, setStickyMenuScroll] = useState(false)
    const [customFields, setCustomFields] = useState([])

    const {
        folders,
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
        productFields,
        loadAssetDimensionLimits,
        loadAssetOrientations,
        loadCampaigns,
        loadChannels,
        loadFileTypes,
        loadProjects,
        loadTags,
        loadCustomFields,
        loadProductFields,
        loadFolders
    } = useContext(FilterContext)

    const getCustomFields = async () => {
        try {
            const { data } = await customFieldsApi.getCustomFieldsWithCount({assetsCount: 'yes', assetLim: 'yes'})

            setCustomFields(data)

            let filter = {}
            let filterValue = {}
            data.map((value, index)=>{
                console.log(value)
                // Select on wont use `all-px` query field
                filter[`all-p${index}`] = {$set: value.type === 'selectOne' ? 'none' :  'all'}
                filter[`custom-p${index}`] = {$set: []}
            })

            // Add filter
            setActiveSortFilter(update(activeSortFilter, filter))
        } catch (err) {
            // TODO: Maybe show error?
        }
    }

    useEffect(() => {
        window.addEventListener("scroll", () => {
            setStickyMenuScroll(window.scrollY > 215)
        })

        getCustomFields()
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
                {!isFolder &&
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
                                anyAllSelection={activeSortFilter.allTags}
                                setAnyAll={(value) => setActiveSortFilter(update(activeSortFilter, { allTags: { $set: value } }))}
                                loadFn={loadTags}
                                filters={tags.map(tag => ({ ...tag, label: tag.name, value: tag.id }))}
                                value={activeSortFilter.filterTags}
                                setValue={(selected) => setSortFilterValue('filterTags', selected)}
                                addtionalClass={'tags-container'}
                            />}
                    </section>
                }

                {customFields.map((field, index)=>{
                    return <>
                        {!isFolder &&
                        <section key={index}>
                            <div className={styles['expand-bar']} onClick={() => handleExpand('customFields')}>
                                <h4>{field.name}</h4>
                                {expandedMenus.includes('customFields') ?
                                    <img src={Utilities.arrowUpGrey} className={styles['expand-icon']} /> :
                                    <img src={Utilities.arrowGrey} className={styles['expand-icon']} />}
                            </div>
                            {expandedMenus.includes('customFields') &&
                            <FilterSelector
                                numItems={10}
                                anyAllSelection={field.type === 'selectMultiple' ? activeSortFilter[`all-p${index}`] : ''}
                                setAnyAll={field.type === 'selectMultiple' ? (value) => setActiveSortFilter(update(activeSortFilter, { [`all-p${index}`]: { $set: value } })) : () => {}}
                                loadFn={()=>{}}
                                filters={field.values.map(tag => ({ ...tag, label: tag.name, value: tag.id }))}
                                value={activeSortFilter[`custom-p${index}`]}
                                setValue={(selected) => setSortFilterValue(`custom-p${index}`, selected)}
                                addtionalClass={'tags-container'}
                            />}
                        </section>
                        }
                    </>
                })}
                {!isFolder &&
                    <section>
                        <div className={styles['expand-bar']} onClick={() => handleExpand('channels')}>
                            <h4>Channels</h4>
                            {expandedMenus.includes('channels') ?
                                <img src={Utilities.arrowUpGrey} className={styles['expand-icon']} /> :
                                <img src={Utilities.arrowGrey} className={styles['expand-icon']} />}
                        </div>
                        {expandedMenus.includes('channels') &&
                            <FilterSelector
                                capitalize={true}
                                searchBar={false}
                                numItems={8}
                                loadFn={loadChannels}
                                filters={channels.map(channel => ({ ...channel, label: channel.name, value: channel.name }))}
                                value={activeSortFilter.filterChannels}
                                setValue={(selected) => setSortFilterValue('filterChannels', selected)}
                            />}
                    </section>
                }
                {!isFolder &&
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
                                anyAllSelection={activeSortFilter.allCampaigns}
                                setAnyAll={(value) => setActiveSortFilter(update(activeSortFilter, { allCampaigns: { $set: value } }))}
                                loadFn={loadCampaigns}
                                numItems={5}
                                filters={campaigns.map(campaign => ({ ...campaign, label: campaign.name, value: campaign.id }))}
                                value={activeSortFilter.filterCampaigns}
                                setValue={(selected) => setSortFilterValue('filterCampaigns', selected)}
                            />}
                    </section>
                }
                <section>
                    <div className={styles['expand-bar']} onClick={() => handleExpand('folders')}>
                        <h4>Collections</h4>
                        {expandedMenus.includes('folders') ?
                            <img src={Utilities.arrowUpGrey} className={styles['expand-icon']} /> :
                            <img src={Utilities.arrowGrey} className={styles['expand-icon']} />}
                    </div>
                    {expandedMenus.includes('folders') &&
                        <FilterSelector
                            oneColumn={true}
                            loadFn={loadFolders}
                            numItems={5}
                            filters={folders.map(folder => ({ ...folder, label: folder.name, value: folder.id }))}
                            value={activeSortFilter.filterFolders}
                            setValue={(selected) => setSortFilterValue('filterFolders', selected)}
                        />}
                </section>
                {!isFolder &&
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
                                loadFn={loadProjects}
                                numItems={5}
                                anyAllSelection={activeSortFilter.allProjects}
                                setAnyAll={(value) => setActiveSortFilter(update(activeSortFilter, { allProjects: { $set: value } }))}
                                filters={projects.map(project => ({ ...project, label: project.name, value: project.id }))}
                                value={activeSortFilter.filterProjects}
                                setValue={(selected) => setSortFilterValue('filterProjects', selected)}
                            />}
                    </section>
                }
                {!isFolder &&
                    <section>
                        <div className={styles['expand-bar']} onClick={() => handleExpand('file-types')}>
                            <h4>File Types</h4>
                            {expandedMenus.includes('file-types') ?
                                <img src={Utilities.arrowUpGrey} className={styles['expand-icon']} /> :
                                <img src={Utilities.arrowGrey} className={styles['expand-icon']} />}
                        </div>
                        {expandedMenus.includes('file-types') &&
                            <FilterSelector
                                loadFn={loadFileTypes}
                                searchBar={false}
                                numItems={40}
                                filters={fileTypes.map(fileType => ({ ...fileType, label: fileType.name, value: fileType.name }))}
                                value={activeSortFilter.filterFileTypes}
                                setValue={(selected) => setSortFilterValue('filterFileTypes', selected)}
                            />}
                    </section>
                }
                {!isFolder &&
                    <section>
                        <div className={styles['expand-bar']} onClick={() => handleExpand('product')}>
                            <h4>Product</h4>
                            {expandedMenus.includes('product') ?
                                <img src={Utilities.arrowUpGrey} className={styles['expand-icon']} /> :
                                <img src={Utilities.arrowGrey} className={styles['expand-icon']} />}
                        </div>
                        {expandedMenus.includes('product') &&
                            <ProductFilter
                                loadFn={loadProductFields}
                                productFilters={productFields}
                                setSortFilterValue={setSortFilterValue}
                                fieldsValue={activeSortFilter.filterProductFields}
                            />
                        }
                    </section>
                }
                {!isFolder &&
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
                }
                {!isFolder &&
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
                                loadFn={loadAssetOrientations}
                                numItems={4}
                                filters={assetOrientations.map(orientation => ({ ...orientation, label: orientation.name, value: orientation.name }))}
                                value={activeSortFilter.filterOrientations}
                                setValue={(selected) => setSortFilterValue('filterOrientations', selected)}
                            />}
                    </section>
                }
                {!isFolder &&
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
                                loadFn={loadAssetDimensionLimits}
                                heightDimensionLimits={{ min: minHeight, max: maxHeight }}
                                widthdimensionLimits={{ min: minWidth, max: maxWidth }}
                                handleHeight={({ value }) => setSortFilterValue('dimensionHeight', value)}
                                handleWidth={({ value }) => setSortFilterValue('dimensionWidth', value)}
                                valueHeight={activeSortFilter.dimensionHeight || { min: minHeight, max: maxHeight }}
                                valueWidth={activeSortFilter.dimensionWidth || { min: minWidth, max: maxWidth }}
                            />}
                    </section>
                }
            </div>
        </div>

    )
}

export default FilterContainer
