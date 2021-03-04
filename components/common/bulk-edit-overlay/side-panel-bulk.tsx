import styles from './side-panel-bulk.module.css'
import update from 'immutability-helper'
import ReactCreatableSelect from 'react-select/creatable'

import { AssetContext, UserContext, FilterContext } from '../../../context'
import { useEffect, useState, useContext } from 'react'
import tagApi from '../../../server-api/tag'
import assetApi from '../../../server-api/asset'
import projectApi from '../../../server-api/project'
import campaignApi from '../../../server-api/campaign'
import folderApi from '../../../server-api/folder'
import toastUtils from '../../../utils/toast'
import { Utilities } from '../../../assets'


// Components
import Button from '../buttons/button'
import Tag from '../misc/tag'
import IconClickable from '../buttons/icon-clickable'
import ChannelSelector from '../items/channel-selector'
import CreatableSelect from '../inputs/creatable-select'
import ProjectCreationModal from '../modals/project-creation-modal'
import ProductAddition from '../asset/product-addition'
import ConfirmModal from '../modals/confirm-modal'

const SidePanelBulk = ({
  elementsSelected,
  onUpdate,
  assetProjects,
  setAssetProjects,
  assetCampaigns,
  setCampaigns,
  assetTags,
  setTags,
  originalInputs,
  setLoading,
  loading
}) => {

  const [channel, setChannel] = useState(null)
  const [activeDropdown, setActiveDropdown] = useState('')

  const [inputCampaigns, setInputCampaigns] = useState([])

  const [inputFolders, setInputFolders] = useState([])
  const [assetFolder, setAssetFolder] = useState(null)

  const [inputTags, setInputTags] = useState([])

  const [inputProjects, setInputProjects] = useState([])

  const [newProjectName, setNewProjectName] = useState('')

  const [assetProduct, setAssetProduct] = useState(null)

  const [warningMessage, setWarningMessage] = useState('')
  const [warningMessage2, setWarningMessage2] = useState('')

  useEffect(() => {
    getInputData()
  }, [])

  const updateChannel = (option) => {
    setChannel(option)
  }

  const getInputData = async () => {
    try {
      const projectsResponse = await projectApi.getProjects()
      const campaignsResponse = await campaignApi.getCampaigns()
      const folderResponse = await folderApi.getFoldersSimple()
      const tagsResponse = await tagApi.getTags()
      setInputProjects(projectsResponse.data)
      setInputCampaigns(campaignsResponse.data)
      setInputFolders(folderResponse.data)
      setInputTags(tagsResponse.data)
    } catch (err) {
      // TODO: Maybe show error?
    }
  }

  const handleProjectChange = (selected, actionMeta) => {
    if (!selected || assetProjects.findIndex(selectedItem => selected.label === selectedItem.name) !== -1) return
    if (actionMeta.action === 'create-option') {
      setNewProjectName(selected.value)
    } else if (selected) {
      setAssetProjects(update(assetProjects, { $push: [selected] }))
    }
  }

  const removeProject = (index) => {
    setAssetProjects(update(assetProjects, { $splice: [[index, 1]] }))
  }

  const onValueChange = (selected, actionMeta) => {
    setActiveDropdown('')
    if (actionMeta.action === 'create-option') {
      setAssetFolder({ ...selected, name: selected.value })
    } else {
      setAssetFolder(selected)
    }
  }

  const prepareSave = () => {
    const warningMessage = `Any campaigns, tags or projects you removed from the list will be also removed from the (${elementsSelected.length}) selected assets.`
    const warningMessage2 = `Any collection, product or channel set will replace the respective property from the (${elementsSelected.length}) selected assets.`
    setWarningMessage(warningMessage)
    setWarningMessage2(warningMessage2)
  }

  const saveChanges = async () => {
    try {
      setWarningMessage('')
      setLoading(true)
      const mapAttributes = ({ id, name }) => ({ id, name })
      const campaigns = assetCampaigns.map(mapAttributes)
      const projects = assetProjects.map(mapAttributes)
      const tags = assetTags.map(mapAttributes)
      const updateObject = {
        assetIds: elementsSelected.map(({ asset: { id } }) => id),
        attributes: {
          channel,
          folders: [],
          campaigns,
          projects,
          tags,
          products: [],
          ...getRemoveAttributes({ campaigns, projects, tags })
        }
      }

      if (assetProduct) updateObject.attributes.products = [{ product: assetProduct, productTags: assetProduct.tags }]
      if (assetFolder) updateObject.attributes.folders = [{ name: assetFolder.name, id: assetFolder.id }]
      await assetApi.updateMultipleAttributes(updateObject)
      onUpdate()
      toastUtils.success('Successfully updated assets')
    } catch (err) {
      console.log(err)
      toastUtils.error('An error occurred, please try again later')
    } finally{
      setLoading(false)
    }
  }

  const getRemoveAttributes = ({ campaigns, projects, tags }) => {
    const filterFn = (chosenList) => origItem => chosenList.findIndex(chosenItem => chosenItem.id === origItem.id) === -1
    return {
      removeCampaigns: originalInputs.campaigns.filter(filterFn(campaigns)),
      removeProjects: originalInputs.projects.filter(filterFn(projects)),
      removeTags: originalInputs.tags.filter(filterFn(tags))
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
          isShare={false}
          onLabelClick={() => { }}
          handleChannelChange={(option) => updateChannel(option)}
        />
      </section>

      <section className={styles['field-wrapper']} >
        <div className={`secondary-text ${styles.field}`}>Collection</div>
        <div className={`normal-text ${styles['collection-container']}`}>
          <p className={styles['collection-name']}>
            {assetFolder && <span className={styles.label}>{assetFolder.name}</span>}
          </p>
          <>
            {activeDropdown === 'collection' ?
              <div className={`tag-select ${styles['select-wrapper']}`}>
                <ReactCreatableSelect
                  options={inputFolders.map(folder => ({ ...folder, label: folder.name, value: folder.id }))}
                  placeholder={'Enter new collection or select an existing one'}
                  onChange={onValueChange}
                  styleType={'regular item'}
                  menuPlacement={'top'}
                  isClearable={true}
                />
              </div>
              :
              <>
                {activeDropdown !== 'collection' &&
                  <div className={`add ${styles['select-add']}`} onClick={() => setActiveDropdown('collection')}>
                    <IconClickable src={Utilities.add} />
                    <span>Add to Collection</span>
                  </div>
                }
              </>
            }
          </>
        </div>
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
          onAddOperationFinished={() => null}
          onRemoveOperationFinished={() => null}
          onOperationFailedSkipped={() => setActiveDropdown('')}
          asyncCreateFn={() => null}
          dropdownIsActive={activeDropdown === 'campaigns'}
          altColor='yellow'
          isShare={false}
          isBulkEdit={true}
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
          onAddOperationFinished={() => null}
          onRemoveOperationFinished={() => null}
          onOperationFailedSkipped={() => setActiveDropdown('')}
          asyncCreateFn={() => null}
          dropdownIsActive={activeDropdown === 'tags'}
          isShare={false}
          isBulkEdit={true}
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
                  canRemove={true}
                  removeFunction={() => removeProject(index)}
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
          product={assetProduct}
          isShare={false}
          isBulkEdit={true}
          setAssetProduct={setAssetProduct}
        />
      </section>

      <ProjectCreationModal
        initialValue={newProjectName}
        closeModal={() => setNewProjectName('')}
        confirmCreation={(project) => handleProjectChange({ ...project, label: project.name }, 'create-option')}
        modalIsOpen={newProjectName}
      />

      <div className={styles['save-changes']}>
        <Button text={'Save Changes'} type={'button'} styleType={'primary'} onClick={prepareSave} disabled={elementsSelected.length === 0 || loading} />
      </div>

      <ConfirmModal
        confirmAction={saveChanges}
        confirmText={'Save changes'}
        closeModal={() => setWarningMessage('')}
        message={warningMessage}
        secondMessage={warningMessage2}
        modalIsOpen={warningMessage}
      />
    </div >
  )
}

export default SidePanelBulk