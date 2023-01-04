import { capitalCase } from 'change-case'

export const DEFAULT_FILTERS = {
    filterCampaigns: [],
    filterChannels: [],
    filterNonAiTags: [],
    filterAiTags: [],
    filterFolders: [],
    filterProjects: [],
    filterFileTypes: [],
    filterOrientations: [],
    filterProductFields: [],
    filterProductSku: undefined,
    filterProductType: [],
    filterCustomFields: [],
    filterResolutions: [],
    allNonAiTags: 'all',
    allAiTags: 'all',
    allCampaigns: 'all',
    allProjects: 'all',
    dimensionWidth: undefined,
    dimensionHeight: undefined,
    beginDate: undefined,
    endDate: undefined,
    fileModifiedBeginDate: undefined,
    fileModifiedEndDate: undefined
}

export const DEFAULT_CUSTOM_FIELD_FILTERS = (userFilterObject) => {
    let filters = {}
    Object.keys(userFilterObject).map((key) => {
        // Custom fields key
        if (key.includes('custom-p')) {
            // Get all keys
            const index = key.split('custom-p')[1]
            filters[`custom-p${index}`] = []
        }

        if (key.includes('all-p')) {
            // Get all keys
            const index = key.split("all-p")[1]
            filters[`all-p${index}`] = 'all'
        }
    })

    return filters
}

export const getAssociatedCampaigns = (asset) => {
    const campaigns = {}
    const { projects, tasks } = asset

    if (projects)
        projects.forEach(project => {
            const { campaign } = project
            if (campaign) {
                campaigns[campaign.id] = campaign.name
            }
        })

    if (tasks)
        tasks.forEach(task => {
            const { project } = task
            if (project) {
                const { campaign } = project
                if (campaign) {
                    campaigns[campaign.id] = campaign.name
                }
            }
        })

    const entries = Object.entries(campaigns)

    if (entries.length > 0)
        return entries.map(([_, name]) => name).join(', ')

    else
        return 'No Campaigns'
}

export const getAssociatedChannels = (asset) => {
    const channels = {}
    const { projects, tasks } = asset

    if (projects)
        projects.forEach(project => {
            const { type } = project
            channels[type] = capitalCase(type)
        })

    if (tasks)
        tasks.forEach(task => {
            const { project } = task
            if (project) {
                const { type } = project
                channels[type] = capitalCase(type)
            }
        })

    const entries = Object.entries(channels)

    if (entries.length > 0)
        return entries.map(([_, name]) => name).join(', ')

    else
        return 'No Channels'
}

export const getParsedExtension = (extension) => {
    switch (extension) {
        case 'msword':
            return 'doc'
        case 'vnd.openxmlformats-officedocument.wordprocessingml.document':
            return 'doc'
        case 'vnd.ms-powerpoint':
            return 'ppt'
        case 'vnd.openxmlformats-officedocument.presentationml.presentation':
            return 'ppt'
        case 'vnd.ms-excel':
            return '.xlsx'
        case 'vnd.openxmlformats-officedocument.spreadsheetml.sheet':
            return '.xlsx'
        default:
            return extension
    }
}

export const getAssetsFilters = ({ replace, userFilterObject, activeFolder = '', addedIds, nextPage }) => {
    const filters = {}
    const {
        mainFilter,
        filterCampaigns = [],
        filterNonAiTags = [],
        filterAiTags = [],
        filterFolders,
        filterChannels,
        filterProjects,
        filterFileTypes,
        filterOrientations,
        filterResolutions,
        dimensionWidth,
        dimensionHeight,
        dimensionsActive,
        beginDate,
        endDate,
        fileModifiedBeginDate,
        fileModifiedEndDate,
        allNonAiTags,
        allAiTags,
        allCampaigns,
        filterProductFields,
        filterProductType,
        filterProductSku
    } = userFilterObject

    if (mainFilter === 'images') {
        filters.type = 'image'
        filters.stage = 'draft'
    }
    else if (mainFilter === 'videos') {
        filters.type = 'video'
        filters.stage = 'draft'
    }
    else if (mainFilter === 'product') {
        filters.hasProducts = 'product'
        filters.stage = 'draft'
    }
    else if (mainFilter === 'archived') filters.stage = 'archived'
    else filters.stage = 'draft'

    addFilterToQuery(filters, filterCampaigns, 'campaigns')
    addFilterToQuery(filters, filterProjects, 'projects')
    addFilterToQuery(filters, filterFolders, 'folders')
    addFilterToQuery(filters, filterChannels, 'channels')
    addFilterTagsToQuery(filters, filterNonAiTags,filterAiTags, 'tags')
    addFilterToQuery(filters, filterFileTypes, 'fileTypes')
    addFilterToQuery(filters, filterOrientations, 'orientations')
    addFilterToQuery(filters, filterResolutions, 'resolutions')

    Object.keys(userFilterObject).map((key) => {
        // Custom fields key
        if (key.includes('custom-p')) {
            // Get all keys
            const index = key.split("custom-p")[1]
            if (userFilterObject[key] && userFilterObject[key].length > 0 && userFilterObject[`all-p${index}`] && userFilterObject[`all-p${index}`] !== 'none') {
                filters[`all-p${index}`] = userFilterObject[`all-p${index}`]
            }
            addFilterToQuery(filters, userFilterObject[key], key, 'id')
        }
    })

    if (activeFolder) {
        filters.folderId = activeFolder
    }

    if (!replace && addedIds.length > 0) {
        filters.excludeIds = addedIds.join(',')
    }

    if (dimensionsActive && dimensionWidth) {
        filters.dimensionWidth = `${dimensionWidth.min},${dimensionWidth.max}`
    }

    if (dimensionsActive && dimensionHeight) {
        filters.dimensionHeight = `${dimensionHeight.min},${dimensionHeight.max}`
    }


    if (beginDate && endDate) {
        // a range in different day
        if(beginDate.toDateString() !== endDate.toDateString()){
            if (beginDate) {
                const d = new Date(beginDate)
                const newDate = new Date(d.getFullYear(), d.getMonth(), d.getDate())

                filters.beginDate = new Date(newDate.toUTCString()).toISOString()
            }

            if (endDate) {
                const d = new Date(endDate)
                const newDate = new Date(d.getFullYear(), d.getMonth(), d.getDate())

                newDate.setDate(newDate.getDate() + 1)

                filters.endDate = new Date(newDate.toUTCString()).toISOString()
            }
        }else{ // same day
            const d = new Date(beginDate)
            const newDate = new Date(d.getFullYear(), d.getMonth(), d.getDate())

            filters.beginDate = new Date(newDate.toUTCString()).toISOString()
        }
    } else {
        // Only have begin date
        if (beginDate) {
            const d = new Date(beginDate)
            const newDate = new Date(d.getFullYear(), d.getMonth(), d.getDate())

            filters.beginDate = new Date(newDate.toUTCString()).toISOString()
        }

        // Only have end date
        if (endDate) {
            const d = new Date(endDate)
            const newDate = new Date(d.getFullYear(), d.getMonth(), d.getDate())

            newDate.setDate(newDate.getDate() + 1)

            filters.endDate = new Date(newDate.toUTCString()).toISOString()
        }
    }

    if(fileModifiedBeginDate && fileModifiedEndDate){
        // a range in different day
        if(fileModifiedBeginDate.toDateString() !== fileModifiedEndDate.toDateString()){
            if (fileModifiedBeginDate) {
                const d = new Date(fileModifiedBeginDate)
                const newDate = new Date(d.getFullYear(), d.getMonth(), d.getDate())

                filters.fileModifiedBeginDate = new Date(newDate.toUTCString()).toISOString()
            }

            if (fileModifiedEndDate) {
                const d = new Date(fileModifiedEndDate)
                const newDate = new Date(d.getFullYear(), d.getMonth(), d.getDate())
                newDate.setDate(newDate.getDate() + 1)

                filters.fileModifiedEndDate = new Date(newDate.toUTCString()).toISOString()
            }

        }else{ // Same date
            const d = new Date(fileModifiedBeginDate)
            const newDate = new Date(d.getFullYear(), d.getMonth(), d.getDate())

            filters.fileModifiedBeginDate = new Date(newDate.toUTCString()).toISOString()
        }
    }else{
        if (fileModifiedBeginDate) {
            const d = new Date(fileModifiedBeginDate)
            const newDate = new Date(d.getFullYear(), d.getMonth(), d.getDate())

            filters.fileModifiedBeginDate = new Date(newDate.toUTCString()).toISOString()
        }

        if (fileModifiedEndDate) {
            const d = new Date(fileModifiedEndDate)
            const newDate = new Date(d.getFullYear(), d.getMonth(), d.getDate())
            newDate.setDate(newDate.getDate() + 1)
            filters.fileModifiedEndDate = new Date(newDate.toUTCString()).toISOString()
        }
    }

    if (filterProductType && filterProductFields?.length > 0) {
        filters.productFields = filterProductFields.map(item => item.value).join(',')
    }

    if (filterProductSku && filterProductSku.length > 0) {
        filters.filterProductSku = filterProductSku.map((item)=>item.sku).join(",")
    }

    if ((filterNonAiTags && filterNonAiTags.length > 0 && allNonAiTags) || allNonAiTags === 'none') filters.allNonAiTags = allNonAiTags


    if (filterAiTags && filterAiTags.length > 0 && allAiTags) filters.allAiTags = allAiTags
    if (filterCampaigns.length > 0 && allCampaigns) filters.allCampaigns = allCampaigns

    filters.page = replace ? 1 : nextPage

    return filters
}

export const getAssetsSort = (userFilterObject) => {
    // /ori/PXL_20210215_215652102.MP.jpg
    if (userFilterObject.sort && userFilterObject.sort.value !== 'none') {
        const { field, order } = userFilterObject.sort
        return {
            sort: `${field},${order}`
        }
    } else return {}
}

export const getFoldersFromUploads = (files, isRegular = false) => {
    const folders = new Set()
    files.forEach(({ path, originalFile }) => {
        let pathToParse = path
        if (isRegular) pathToParse = originalFile.webkitRelativePath
        if (pathToParse.indexOf('/') !== -1) {
            const splitFile = pathToParse.split('/')
            splitFile.forEach((name, index) => {
                if (index < splitFile.length - 1 && name) {
                    folders.add(name)
                }
            })
        }
    })
    return Array.from(folders)
}

const addFilterToQuery = (filters, filterItems, key, valueKey = 'value') => {
    if (filterItems?.length > 0) {
        filters[key] = filterItems.map(item => item[valueKey]).join(',')
    }
}

const addFilterTagsToQuery = (filters, filterItems1,  filterItems2, key, valueKey = 'value') => {
    const items = [];
    if (filterItems1?.length > 0) {
        items.push(...filterItems1.map(item => item[valueKey]))
    }
    if (filterItems2?.length > 0) {
        items.push(...filterItems2.map(item => item[valueKey]))
    }
    if(items.length){
        filters[key] = items.join(',')
    }
}

