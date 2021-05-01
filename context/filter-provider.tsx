import { useState, useEffect } from 'react'
import { FilterContext } from '../context'
import campaignApi from '../server-api/campaign'
import projectApi from '../server-api/project'
import selectOptions from '../utils/select-options'
import tagApi from '../server-api/tag'
import attributeApi from '../server-api/attribute'
import filterApi from '../server-api/filter'
import fodlerApi from '../server-api/folder'
import shareCollectionApi from '../server-api/share-collection'
import { DEFAULT_FILTERS, getAssetsFilters } from '../utils/asset'

export default ({ children, isPublic = false }) => {

  const [activeSortFilter, setActiveSortFilter] = useState({
    sort: selectOptions.sort[1],
    mainFilter: 'all',
    ...DEFAULT_FILTERS,
    dimensionsActive: false
  })
  const [sharePath, setSharePath] = useState('')
  const [tags, setTags] = useState([])
  const [customFields, setCustomFields] = useState([])
  const [campaigns, setCampaigns] = useState([])
  const [folders, setFolders] = useState([])
  const [channels, setChannels] = useState([])
  const [projects, setProjects] = useState([])
  const [fileTypes, setFileTypes] = useState([])
  const [assetDimensionLimits, setAssetDimensionLimits] = useState({})
  const [assetOrientations, setAssetOrientations] = useState([])
  const [productFields, setProductFields] = useState({
    categories: [],
    vendors: [],
    retailers: []
  })
  const [term, setTerm] = useState("")

  const loadAll = () => {
    loadTags()
    loadCampaigns()
    loadChannels()
    loadProjects()
    loadFileTypes()
    loadAssetDimensionLimits()
    loadAssetOrientations()
  }

  const loadFromEndpoint = async (fetchPromise, setMethod) => {
    try {
      const { data } = await fetchPromise
      setMethod(data)
    } catch (err) {
      console.log(err)
    }
  }

  const loadTags = () => {
    const fetchMethod = isPublic ? shareCollectionApi.getTags : tagApi.getTags
    loadFromEndpoint(fetchMethod({ assetsCount: 'yes', sharePath, ...getCommonParams(activeSortFilter.allTags !== 'any') }), setTags)
  }

  const loadCustomFields = () => {
    const fetchMethod = isPublic ? shareCollectionApi.getCustomFields : attributeApi.getCustomFields
    loadFromEndpoint(fetchMethod({ assetsCount: 'yes', sharePath, ...getCommonParams(activeSortFilter.allCustomFields !== 'any') }), setCustomFields)
  }

  const loadFolders = () => {
    const fetchMethod = fodlerApi.getFoldersSimple
    loadFromEndpoint(fetchMethod(({ assetsCount: 'yes', ...getCommonParams() })), setFolders)
  }

  const loadCampaigns = () => {
    const fetchMethod = isPublic ? shareCollectionApi.getCampaigns : campaignApi.getCampaigns
    loadFromEndpoint(fetchMethod({ assetsCount: 'yes', sharePath, ...getCommonParams(activeSortFilter.allCampaigns !== 'any') }), setCampaigns)
  }

  const loadChannels = () => {
    const fetchMethod = isPublic ? shareCollectionApi.getAssetChannels : filterApi.getAssetChannels
    loadFromEndpoint(fetchMethod({ sharePath, ...getCommonParams() }), setChannels)
  }

  const loadProjects = () => {
    const fetchMethod = isPublic ? shareCollectionApi.getProjects : projectApi.getProjects
    loadFromEndpoint(fetchMethod({ assetsCount: 'yes', sharePath, ...getCommonParams(activeSortFilter.allProjects !== 'any') }), setProjects)
  }

  const loadFileTypes = () => {
    const fetchMethod = isPublic ? shareCollectionApi.getAssetFileExtensions : filterApi.getAssetFileExtensions
    loadFromEndpoint(fetchMethod({ sharePath, ...getCommonParams() }), setFileTypes)
  }

  const loadAssetDimensionLimits = () => {
    const fetchMethod = isPublic ? shareCollectionApi.getAssetDimensionLimits : filterApi.getAssetDimensionLimits
    loadFromEndpoint(fetchMethod({ sharePath, ...getCommonParams() }), setAssetDimensionLimits)
  }

  const loadAssetOrientations = () => {
    const fetchMethod = isPublic ? shareCollectionApi.getAssetOrientations : filterApi.getAssetOrientations
    loadFromEndpoint(fetchMethod({ sharePath, ...getCommonParams() }), setAssetOrientations)
  }

  const loadProductFields = async () => {
    try {
      const fetchMethod = isPublic ? shareCollectionApi.getTags : tagApi.getTags
      const { data: categories } = await fetchMethod({ type: 'product_category', sharePath, ...getCommonParams() })
      const { data: vendors } = await fetchMethod({ type: 'product_vendor', sharePath, ...getCommonParams() })
      const { data: retailers } = await fetchMethod({ type: 'product_retailer', sharePath, ...getCommonParams() })
      setProductFields({
        categories,
        vendors,
        retailers
      })
    } catch (err) {
      console.log(err)
    }
  }

  const isAnyAll = () => {
    const { allTags, allCampaigns, allProjects, filterCampaigns, filterTags, filterProjects } = activeSortFilter
    return (allTags !== 'any' && filterTags.length > 0)
      || (allCampaigns !== 'any' && filterCampaigns.length > 0)
      || (allProjects !== 'any' && filterProjects.length > 0)
  }

  const getCommonParams = (assetLim = false) => {
    const params = getAssetsFilters({
      replace: false,
      addedIds: [],
      nextPage: 0,
      userFilterObject: activeSortFilter
    })
    if (assetLim || (isAnyAll() && anyFilters())) params.assetLim = 'yes'
    return params
  }

  const anyFilters = () => {
    const {
      filterCampaigns,
      filterChannels,
      filterTags,
      filterFolders,
      filterProjects,
      filterFileTypes,
      filterOrientations,
      filterProductFields,
      filterProductType
    } = activeSortFilter
    if (filterCampaigns?.length > 0) return true
    if (filterChannels?.length > 0) return true
    if (filterTags?.length > 0) return true
    if (filterFolders?.length > 0) return true
    if (filterProjects?.length > 0) return true
    if (filterFileTypes?.length > 0) return true
    if (filterOrientations?.length > 0) return true
    if (filterProductFields?.length > 0) return true
    if (filterProductType?.length > 0) return true
    return false
  }

  const setSearchTerm = (value) => {
    setTerm(value);
  }

  const filterValue = {
    loadAll,
    tags,
    loadTags,
    customFields,
    loadCustomFields,
    campaigns,
    loadCampaigns,
    channels,
    loadChannels,
    projects,
    loadProjects,
    fileTypes,
    loadFileTypes,
    assetDimensionLimits,
    loadAssetDimensionLimits,
    assetOrientations,
    loadAssetOrientations,
    productFields,
    loadProductFields,
    folders,
    loadFolders,
    activeSortFilter,
    setActiveSortFilter,
    setSharePath,
    term,
    setSearchTerm
  }
  return (
    <FilterContext.Provider value={filterValue}>
      {children}
    </FilterContext.Provider>
  )
}
