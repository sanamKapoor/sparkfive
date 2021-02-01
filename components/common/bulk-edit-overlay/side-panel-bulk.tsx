import styles from './side-panel-bulk.module.css'
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


// Components
import Button from '../buttons/button'
import Tag from '../misc/tag'
import IconClickable from '../buttons/icon-clickable'
import ChannelSelector from '../items/channel-selector'
import CreatableSelect from '../inputs/creatable-select'
import ProjectCreationModal from '../modals/project-creation-modal'
import ProductAddition from '../asset/product-addition'

const SidePanelBulk = ({elementsSelected}) => {

  const collections = [
    {
      id: '1',
      name: 'col1'
    },
    {
      id: '2',
      name: 'col2'
    },
    {
      id: '3',
      name: 'col3'
    }
  ]

  const [channel, setChannel] = useState(null)
  const [activeDropdown, setActiveDropdown] = useState('')
  const [inputCampaigns, setInputCampaigns] = useState([])
  const [assetCampaigns, setCampaigns] = useState([])
  const [inputCollections, setInputCollections] = useState([])
  const [assetCollections, setCollections] = useState([])
  const [inputTags, setInputTags] = useState([])
  const [assetTags, setTags] = useState([])
  const [assetProjects, setProjects] = useState([])
  const [inputProjects, setInputProjects] = useState([])
  const [newProjectName, setNewProjectName] = useState('')

  useEffect(() => {
    getInputData()
    getTagsInputData()
  }, [])

  const updateChannel = (option) => {
    setChannel(option)
  }
  
  const getInputData = async () => {
    try {
      const projectsResponse = await projectApi.getProjects()
      const campaignsResponse = await campaignApi.getCampaigns()
      setInputProjects(projectsResponse.data)
      setInputCampaigns(campaignsResponse.data)
      setInputCollections(collections)
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
  const handleProjectChange = async (selected, actionMeta) => {
    // const newCampaign = await addCampaign(selected, actionMeta.action === 'create-option')
    if (actionMeta.action === 'create-option') {
      setNewProjectName(selected.value)
    } 
  }
  

  return (
    <div className={styles.container}>
      <h2>Apply Attributes to Selected Assets</h2>
      <section className={styles['first-section']}>
        <p>{`Editing (${elementsSelected.length}) files`}</p>
      </section>
      <section className={styles['field-wrapper']} >
        <div className={`secondary-text ${styles.field}`}>Channel</div>
        <ChannelSelector
          channel={channel || undefined}
          // isShare={isShare}
          onLabelClick={() => { }}
          handleChannelChange={(option) => updateChannel(option)}
        />
      </section>

      <section className={styles['field-wrapper']} >
        <CreatableSelect
          title='Collections'
          addText='Add to Collection'
          onAddClick={() => setActiveDropdown('collections')}
          selectPlaceholder={'Enter a new collection or select an existing one'}
          avilableItems={inputCollections}
          setAvailableItems={setInputCollections}
          selectedItems={assetCollections}
          setSelectedItems={setCollections}
          onAddOperationFinished={() => null }
          onRemoveOperationFinished={() => null }
          onOperationFailedSkipped={() => setActiveDropdown('')}
          asyncCreateFn={() => null}
          dropdownIsActive={activeDropdown === 'collections'}
          altColor='yellow'
        />
      </section>

      <section className={styles['field-wrapper']} >
        <CreatableSelect
          title='Campaigns'
          addText='Add to Campaign'
          onAddClick={() => setActiveDropdown('campaigns')}
          selectPlaceholder={'Enter a new campaign or select an existing one'}
          avilableItems={inputCampaigns}
          setAvailableItems={setInputCampaigns}
          selectedItems={assetCampaigns}
          setSelectedItems={setCampaigns}
          onAddOperationFinished={() => null }
          onRemoveOperationFinished={() => null }
          onOperationFailedSkipped={() => setActiveDropdown('')}
          asyncCreateFn={() => null}
          dropdownIsActive={activeDropdown === 'campaigns'}
          altColor='yellow'
        />
      </section>

      <section className={styles['field-wrapper']} >
        <CreatableSelect
          title='Tags'
          addText='Add Tags'
          onAddClick={() => setActiveDropdown('tags')}
          selectPlaceholder={'Enter a new tag or select an existing one'}
          avilableItems={inputTags}
          setAvailableItems={setInputTags}
          selectedItems={assetTags}
          setSelectedItems={setTags}
          onAddOperationFinished={() => null }
          onRemoveOperationFinished={() => null }
          onOperationFailedSkipped={() => setActiveDropdown('')}
          asyncCreateFn={() => null}
          dropdownIsActive={activeDropdown === 'tags'}
        />
      </section>

      <section className={styles['field-wrapper']} >
        <div className={`secondary-text ${styles.field}`}>Projects</div>
        <div className={'normal-text'}>
          <ul className={`tags-list ${styles['tags-list']}`}>
            {assetProjects?.map((project, index) => (
              <li key={project.id}>
                <Tag
                  altColor='turquoise'
                  tag={project.name}
                  // canRemove={!isShare}
                  // removeFunction={() => handleAssociationChange(project.id, 'projects', 'remove')}
                />
              </li>
            ))}
          </ul>
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
        </div>
      </section>

      <section>
        <ProductAddition
          FieldWrapper={({ children }) => (
            <div className={styles['field-wrapper']} >{children}</div>
          )}
          activeDropdown={activeDropdown}
          setActiveDropdown={setActiveDropdown}
          assetId={null}
          updateAssetState={() => null}
          product={null}
        />
      </section>

      <ProjectCreationModal
        initialValue={newProjectName}
        closeModal={() => setNewProjectName('')}
        // confirmCreation={addNewProject}
        modalIsOpen={newProjectName}
      />
      
      <div className={styles['save-changes']}><Button text={'Save Changes'} type={'button'} styleType={'primary'} /></div>
    </div >
  )
}

export default SidePanelBulk