import { useState, useEffect } from 'react'
import { FilterContext } from '../context'
import campaignApi from '../server-api/campaign'
import projectApi from '../server-api/project'
import tagApi from '../server-api/tag'
import filterApi from '../server-api/filter'
import fodlerApi from '../server-api/folder'
import shareCollectionApi from '../server-api/share-collection'

export default ({ children, isPublic = false, sharePath = '' }) => {

  const [tags, setTags] = useState([])
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
    loadFromEndpoint(fetchMethod({ assetsCount: 'yes', sharePath }), setTags)
  }

  const loadFolders = () => {
    const fetchMethod = fodlerApi.getFoldersSimple
    loadFromEndpoint(fetchMethod(), setFolders)
  }

  const loadCampaigns = () => {
    const fetchMethod = isPublic ? shareCollectionApi.getCampaigns : campaignApi.getCampaigns
    loadFromEndpoint(fetchMethod({ assetsCount: 'yes', sharePath }), setCampaigns)
  }

  const loadChannels = () => {
    const fetchMethod = isPublic ? shareCollectionApi.getAssetChannels : filterApi.getAssetChannels
    loadFromEndpoint(fetchMethod({ sharePath }), setChannels)
  }

  const loadProjects = () => {
    const fetchMethod = isPublic ? shareCollectionApi.getProjects : projectApi.getProjects
    loadFromEndpoint(fetchMethod({ assetsCount: 'yes', sharePath }), setProjects)
  }

  const loadFileTypes = () => {
    const fetchMethod = isPublic ? shareCollectionApi.getAssetFileExtensions : filterApi.getAssetFileExtensions
    loadFromEndpoint(fetchMethod({ sharePath }), setFileTypes)
  }

  const loadAssetDimensionLimits = () => {
    const fetchMethod = isPublic ? shareCollectionApi.getAssetDimensionLimits : filterApi.getAssetDimensionLimits
    loadFromEndpoint(fetchMethod({ sharePath }), setAssetDimensionLimits)
  }

  const loadAssetOrientations = () => {
    const fetchMethod = isPublic ? shareCollectionApi.getAssetOrientations : filterApi.getAssetOrientations
    loadFromEndpoint(fetchMethod({ sharePath }), setAssetOrientations)
  }

  const loadProductFields = async () => {
    try {
      const { data: categories } = await tagApi.getTags({ type: 'product_category' })
      const { data: vendors } = await tagApi.getTags({ type: 'product_vendor' })
      const { data: retailers } = await tagApi.getTags({ type: 'product_retailer' })
      setProductFields({
        categories,
        vendors,
        retailers
      })
    } catch (err) {

    }
  }

  const filterValue = {
    loadAll,
    tags,
    loadTags,
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
    loadFolders
  }
  return (
    <FilterContext.Provider value={filterValue}>
      {children}
    </FilterContext.Provider>
  )
}