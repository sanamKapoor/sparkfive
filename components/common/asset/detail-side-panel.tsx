import styles from './detail-side-panel.module.css'
import update from 'immutability-helper'
import CreatableSelect from 'react-select/creatable';

import { AssetContext, UserContext } from '../../../context'
import { useEffect, useState, useContext } from 'react'
import { format } from 'date-fns'
import { capitalCase } from 'change-case'
import filesize from 'filesize'
import { getAssociatedCampaigns, getAssociatedChannels, getParsedExtension } from '../../../utils/asset'
import tagApi from '../../../server-api/tag'
import assetApi from '../../../server-api/asset'
import projectApi from '../../../server-api/project'
import campaignApi from '../../../server-api/campaign'
import { Utilities } from '../../../assets'

import channelSocialOptions from '../../../resources/data/channels-social.json'
import {
  CALENDAR_ACCESS
} from '../../../constants/permissions'

// Components
import Tag from '../misc/tag'
import IconClickable from '../buttons/icon-clickable'
import ChannelSelector from '../items/channel-selector'
import ProjectCreationModal from '../modals/project-creation-modal'

const SidePanel = ({ asset, updateAsset, isShare }) => {
  const {
    id,
    createdAt,
    type,
    extension,
    dimension,
    size,
    tags,
    campaigns,
    projects,
    channel
  } = asset

  const { assets, setAssets } = useContext(AssetContext)
  const { hasPermission } = useContext(UserContext)

  const [inputCampaigns, setInputCampaigns] = useState([])
  const [inputTags, setInputTags] = useState([])
  const [inputProjects, setInputProjects] = useState([])

  const [assetTags, setTags] = useState(tags)
  const [assetCampaigns, setCampaigns] = useState(campaigns)
  const [assetProjects, setProjects] = useState(projects)

  const [activeDropdown, setActiveDropdown] = useState('')

  const [newProjectName, setNewProjectName] = useState('')

  useEffect(() => {
    setTags(tags)
    setCampaigns(campaigns)
    setProjects(projects)
  }, [asset])

  useEffect(() => {
    if (!isShare) {
      getTagsInputData()
      if (hasPermission([CALENDAR_ACCESS])) {
        getInputData()
      }
    }
  }, [])

  const getInputData = async () => {
    try {
      const projectsResponse = await projectApi.getProjects()
      const campaignsResponse = await campaignApi.getCampaigns()
      setInputProjects(projectsResponse.data)
      setInputCampaigns(campaignsResponse.data)
    } catch (err) {
      // TODO: Maybe show error?
    }
  }

  const getTagsInputData = async () => {
    try {
      const tagsResponse = await tagApi.getTags()
      setInputTags(tagsResponse.data)
    } catch (err) {
      // TODO: Maybe show error?
    }
  }

  const addTag = async (tag, isNew = false) => {
    if (tags.findIndex(assetTag => tag.label === assetTag.name) === -1) {
      const newTag = { name: tag.label }
      if (!isNew) newTag.id = tag.value
      try {
        const { data } = await assetApi.addTag(id, newTag)
        let stateTagsUpdate
        if (!isNew) {
          stateTagsUpdate = update(assetTags, { $push: [newTag] })
          setTags(stateTagsUpdate)
        } else {
          stateTagsUpdate = update(assetTags, { $push: [data] })
          setTags(stateTagsUpdate)
          setInputTags(update(inputTags, { $push: [data] }))
        }
        updateAssetState({
          tags: { $set: stateTagsUpdate }
        })
        setActiveDropdown('')
        return data
      } catch (err) {
        // TODO: Error if failure for whatever reason
        setActiveDropdown('')
      }
    } else {
      setActiveDropdown('')
    }
  }

  const removeTag = async (index) => {
    try {
      let stateTagsUpdate = update(assetTags, { $splice: [[index, 1]] })
      setTags(stateTagsUpdate)
      await assetApi.removeTag(id, assetTags[index].id)
      updateAssetState({
        tags: { $set: stateTagsUpdate }
      })
    } catch (err) {
      // TODO: Error if failure for whatever reason
    }
  }

  const addCampaign = async (campaign, isNew = false) => {
    if (campaigns.findIndex(assetCampaign => campaign.label === assetCampaign.name) === -1) {
      const newCampaign = { name: campaign.label }
      if (!isNew) newCampaign.id = campaign.value
      try {
        const { data } = await assetApi.addCampaign(id, newCampaign)
        let stateCampaignsUpdate
        if (!isNew) {
          stateCampaignsUpdate = update(assetCampaigns, { $push: [newCampaign] })
          setCampaigns(stateCampaignsUpdate)
        } else {
          stateCampaignsUpdate = update(assetCampaigns, { $push: [data] })
          setCampaigns(stateCampaignsUpdate)
          setInputCampaigns(update(inputCampaigns, { $push: [data] }))
        }
        updateAssetState({
          campaigns: { $set: stateCampaignsUpdate }
        })
        setActiveDropdown('')
        return data
      } catch (err) {
        // TODO: Error if failure for whatever reason
        setActiveDropdown('')
      }
    } else {
      setActiveDropdown('')
    }
  }

  const removeCampaign = async (index) => {
    try {
      let stateCampaignsUpdate = update(assetCampaigns, { $splice: [[index, 1]] })
      setCampaigns(stateCampaignsUpdate)
      await assetApi.removeCampaign(id, assetCampaigns[index].id)
      updateAssetState({
        campaigns: { $set: stateCampaignsUpdate }
      })
    } catch (err) {
      // TODO: Error if failure for whatever reason
    }
  }

  const addNewProject = async (newProjectData) => {
    try {
      let type = newProjectData.channel
      let channel
      if (channelSocialOptions.includes(newProjectData.channel)) {
        type = 'social'
        channel = newProjectData.channel
      }
      const { data: newProject } = await assetApi.addProject(id, { ...newProjectData, type, channel })
      const stateProjectsUpdate = update(assetProjects, { $push: [newProject] })
      setProjects(stateProjectsUpdate)
      setInputCampaigns(update(inputProjects, { $push: [newProject] }))
    } catch (err) {
      // TODO: Error if failure for whatever reason
    }
  }

  const updateAssetState = (updatedata) => {
    const assetIndex = assets.findIndex(assetItem => assetItem.asset.id === id)
    setAssets(update(assets, {
      [assetIndex]: {
        asset: updatedata
      }
    }))
    setActiveDropdown('')
  }

  const handleTagChange = async (selected, actionMeta) => {
    const newTag = await addTag(selected, actionMeta.action === 'create-option')
    if (actionMeta.action === 'create-option') {
      setInputTags(update(inputTags, { $push: [newTag] }))
    }
  }

  const handleCampaignChange = async (selected, actionMeta) => {
    const newCampaign = await addCampaign(selected, actionMeta.action === 'create-option')
    if (actionMeta.action === 'create-option') {
      setInputTags(update(inputCampaigns, { $push: [newCampaign] }))
    }
  }

  const handleProjectChange = async (selected, actionMeta) => {
    // const newCampaign = await addCampaign(selected, actionMeta.action === 'create-option')
    if (actionMeta.action === 'create-option') {
      setNewProjectName(selected.value)
    } else {
      handleAssociationChange(selected.value, 'projects', 'add')
    }
  }

  const handleAssociationChange = async (id, type, operation) => {
    // Only perform operations if item exists/are abcent
    if (operation === 'add') {
      if (asset[type].findIndex(item => item.id === id) !== -1) return
    } else if (operation === 'remove') {
      if (asset[type].findIndex(item => item.id === id) === -1) return
    }
    updateAsset({
      updateData: {}, associations: {
        [type]: {
          [operation]: [id]
        }
      }
    })
    setActiveDropdown('')
  }

  const updateChannel = async (channel) => {
    await updateAsset({ updateData: { channel } })
  }

  let formattedDimension
  if (dimension) {
    const splitDimension = dimension.split(',')
    formattedDimension = `${splitDimension[0]} x  ${splitDimension[1]} px`
  }

  const fieldValues = [
    {
      field: 'Created',
      value: format(new Date(createdAt), 'Pp')
    },
    {
      field: 'Type',
      value: capitalCase(type)
    },
    {
      field: 'Extension',
      value: getParsedExtension(extension)
    },
    {
      field: 'Dimension',
      value: formattedDimension
    },
    {
      field: 'Size',
      value: filesize(size)
    },
    {
      field: 'Campaigns',
      value: getAssociatedCampaigns(asset)
    },
    {
      field: 'Channels',
      value: getAssociatedChannels(asset)
    }
  ]

  console.log(assetProjects)

  return (
    <div className={styles.container}>
      <h2>Details</h2>
      {fieldValues.map(fieldvalue => (
        <div className={styles['field-wrapper']} key={fieldvalue.field}>
          <div className={`secondary-text ${styles.field}`}>{fieldvalue.field}</div>
          <div className={'normal-text'}>{fieldvalue.value}</div>
        </div>
      ))}

      <div className={styles['field-wrapper']} >
        <div className={`secondary-text ${styles.field}`}>Asset Channel</div>
        <ChannelSelector
          channel={channel || undefined}
          onLabelClick={() => { }}
          handleChannelChange={(option) => updateChannel(option)}
        />
      </div>

      <div className={styles['field-wrapper']} >
        <div className={`secondary-text ${styles.field}`}>Asset Campaigns</div>
        <div className={'normal-text'}>
          <ul className={`tags-list ${styles['tags-list']}`}>
            {assetCampaigns?.map((campaign, index) => (
              <li key={campaign.id}>
                <Tag
                  altColor='yellow'
                  tag={campaign.name}
                  canRemove={!isShare}
                  removeFunction={() => removeCampaign(index)}
                />
              </li>
            ))}
          </ul>
          {!isShare &&
            <>
              {activeDropdown === 'campaigns' ?
                <div className={`tag-select ${styles['select-wrapper']}`}>
                  <CreatableSelect
                    placeholder={'Enter a new campaign or select an existing one'}
                    options={inputCampaigns.map(campaign => ({ label: campaign.name, value: campaign.id }))}
                    onChange={handleCampaignChange}
                    styleType={'regular item'}
                    menuPlacement={'top'}
                    isClearable={true}
                  />
                </div>
                :
                <div className={`add ${styles['select-add']}`} onClick={() => setActiveDropdown('campaigns')}>
                  <IconClickable src={Utilities.add} />
                  <span>Add to Campaign</span>
                </div>
              }
            </>
          }
        </div>
      </div>

      <div className={styles['field-wrapper']} >
        <div className={`secondary-text ${styles.field}`}>Tags</div>
        <div className={'normal-text'}>
          <ul className={`tags-list ${styles['tags-list']}`}>
            {assetTags?.map((tag, index) => (
              <li key={tag.id}>
                <Tag
                  tag={tag.name}
                  canRemove={!isShare}
                  removeFunction={() => removeTag(index)}
                />
              </li>
            ))}
          </ul>
          {!isShare &&
            <>
              {activeDropdown === 'tags' ?
                <div className={`tag-select ${styles['select-wrapper']}`}>
                  <CreatableSelect
                    placeholder={'Enter a new tag or select an existing one'}
                    options={inputTags.map(tag => ({ label: tag.name, value: tag.id }))}
                    className={`regular item`}
                    onChange={handleTagChange}
                    menuPlacement={'top'}
                    styleType={'regular item'}
                    isClearable={true}
                  />
                </div>
                :
                <div className={`add ${styles['select-add']}`} onClick={() => setActiveDropdown('tags')}>
                  <IconClickable src={Utilities.add} />
                  <span>Add Tag</span>
                </div>
              }
            </>
          }
        </div>
      </div>

      <div className={styles['field-wrapper']} >
        <div className={`secondary-text ${styles.field}`}>Projects</div>
        <div className={'normal-text'}>
          <ul className={`tags-list ${styles['tags-list']}`}>
            {assetProjects?.map((project, index) => (
              <li key={project.id}>
                <Tag
                  altColor='turquoise'
                  tag={project.name}
                  canRemove={!isShare}
                  removeFunction={() => handleAssociationChange(project.id, 'projects', 'remove')}
                />
              </li>
            ))}
          </ul>
          {!isShare && hasPermission([CALENDAR_ACCESS]) &&
            <>
              {activeDropdown === 'projects' ?
                <div className={`tag-select ${styles['select-wrapper']}`}>
                  <CreatableSelect
                    options={inputProjects.map(project => ({ ...project, label: project.name, value: project.id }))}
                    placeholder={'Enter new project or select an existing one'}
                    onChange={handleProjectChange}
                    styleType={'regular item'}
                    menuPlacement={'top'}
                    isClearable={true}
                  />
                </div>
                :
                <div className={`add ${styles['select-add']}`} onClick={() => setActiveDropdown('projects')}>
                  <IconClickable src={Utilities.add} />
                  <span>Add to Project</span>
                </div>
              }
            </>
          }
        </div>
      </div>
      <ProjectCreationModal
        initialValue={newProjectName}
        closeModal={() => setNewProjectName('')}
        confirmCreation={addNewProject}
        modalIsOpen={newProjectName}
      />
    </div >
  )
}

export default SidePanel