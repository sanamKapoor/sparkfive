import styles from './detail-side-panel.module.css'
import update from 'immutability-helper'
import ReactCreatableSelect from 'react-select/creatable'

import { AssetContext, UserContext, FilterContext } from '../../../context'
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
import CreatableSelect from '../inputs/creatable-select'
import ProjectCreationModal from '../modals/project-creation-modal'
import ProductAddition from './product-addition'

const SidePanel = ({ asset, updateAsset, setAssetDetail, isShare }) => {
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
    channel,
    product
  } = asset

  const { assets, setAssets } = useContext(AssetContext)
  const { hasPermission } = useContext(UserContext)
  const { loadCampaigns, loadProjects, loadTags, loadChannels } = useContext(FilterContext)

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
      setInputProjects(update(inputProjects, { $push: [newProject] }))
      loadProjects()
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
    setAssetDetail(update(asset, updatedata))
    setActiveDropdown('')
  }

  const handleProjectChange = async (selected, actionMeta) => {
    // const newCampaign = await addCampaign(selected, actionMeta.action === 'create-option')
    if (actionMeta.action === 'create-option') {
      setNewProjectName(selected.value)
    } else if (selected) {
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
    }
  ]

  return (
    <div className={styles.container}>
      <h2>Details</h2>
      <div className={styles['first-section']}>
        {fieldValues.map(fieldvalue => (
          <div className={styles['field-wrapper']} key={fieldvalue.field}>
            <div className={`secondary-text ${styles.field}`}>{fieldvalue.field}</div>
            <div className={'normal-text'}>{fieldvalue.value}</div>
          </div>
        ))}
      </div>

      <div className={styles['field-wrapper']} >
        <div className={`secondary-text ${styles.field}`}>Channel</div>
        <ChannelSelector
          channel={channel || undefined}
          onLabelClick={() => { }}
          handleChannelChange={(option) => updateChannel(option)}
        />
      </div>

      <div className={styles['field-wrapper']} >
        <CreatableSelect
          title='Campaigns'
          addText='Add to Campaign'
          onAddClick={() => setActiveDropdown('campaigns')}
          selectPlaceholder={'Enter a new campaign or select an existing one'}
          avilableItems={inputCampaigns}
          setAvailableItems={setInputCampaigns}
          selectedItems={assetCampaigns}
          setSelectedItems={setCampaigns}
          onAddOperationFinished={(stateUpdate) => {
            updateAssetState({
              campaigns: { $set: stateUpdate }
            })
            loadCampaigns()
          }}
          onRemoveOperationFinished={async (index, stateUpdate) => {
            await assetApi.removeCampaign(id, assetCampaigns[index].id)
            updateAssetState({
              campaigns: { $set: stateUpdate }
            })
          }}
          onOperationFailedSkipped={() => setActiveDropdown('')}
          isShare={isShare}
          asyncCreateFn={(newItem) => assetApi.addCampaign(id, newItem)}
          dropdownIsActive={activeDropdown === 'campaigns'}
          altColor='yellow'
        />
      </div>

      <div className={styles['field-wrapper']} >
        <CreatableSelect
          title='Tags'
          addText='Add Tags'
          onAddClick={() => setActiveDropdown('tags')}
          selectPlaceholder={'Enter a new tag or select an existing one'}
          avilableItems={inputTags}
          setAvailableItems={setInputTags}
          selectedItems={assetTags}
          setSelectedItems={setTags}
          onAddOperationFinished={(stateUpdate) => {
            updateAssetState({
              tags: { $set: stateUpdate }
            })
            loadTags()
          }}
          onRemoveOperationFinished={async (index, stateUpdate) => {
            await assetApi.removeTag(id, assetTags[index].id)
            updateAssetState({
              tags: { $set: stateUpdate }
            })
          }}
          onOperationFailedSkipped={() => setActiveDropdown('')}
          isShare={isShare}
          asyncCreateFn={(newItem) => assetApi.addTag(id, newItem)}
          dropdownIsActive={activeDropdown === 'tags'}
        />
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
                  <ReactCreatableSelect
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
      <ProductAddition
        FieldWrapper={({ children }) => (
          <div className={styles['field-wrapper']} >{children}</div>
        )}
        isShare={isShare}
        activeDropdown={activeDropdown}
        setActiveDropdown={setActiveDropdown}
        assetId={id}
        updateAssetState={updateAssetState}
        product={product}
      />

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