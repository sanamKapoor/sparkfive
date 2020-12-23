import { useState, useEffect } from 'react'
import { FilterContext } from '../context'
import campaignApi from '../server-api/campaign'
import projectApi from '../server-api/project'
import tagApi from '../server-api/tag'
import filterApi from '../server-api/filter'

export default ({ children }) => {

  const [tags, setTags] = useState([])
  const [campaigns, setCampaigns] = useState([])
  const [channels, setChannels] = useState([])
  const [projects, setProjects] = useState([])
  const [fileTypes, setFileTypes] = useState([])
  const [assetDimensionLimits, setAssetDimensionLimits] = useState({})
  const [assetOrientations, setAssetOrientations] = useState([])

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
    loadFromEndpoint(tagApi.getTags({ assetsCount: 'yes' }), setTags)
  }

  const loadCampaigns = () => {
    loadFromEndpoint(campaignApi.getCampaigns({ assetsCount: 'yes' }), setCampaigns)
  }

  const loadChannels = () => {
    loadFromEndpoint(filterApi.getAssetChannels(), setChannels)
  }

  const loadProjects = () => {
    loadFromEndpoint(projectApi.getProjects({ assetsCount: 'yes' }), setProjects)
  }

  const loadFileTypes = () => {
    loadFromEndpoint(filterApi.getAssetFileExtensions(), setFileTypes)
  }

  const loadAssetDimensionLimits = () => {
    loadFromEndpoint(filterApi.getAssetDimensionLimits(), setAssetDimensionLimits)
  }

  const loadAssetOrientations = () => {
    loadFromEndpoint(filterApi.getAssetOrientations(), setAssetOrientations)
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
  }
  return (
    <FilterContext.Provider value={filterValue}>
      {children}
    </FilterContext.Provider>
  )
}