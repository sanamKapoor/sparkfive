import styles from './side-panel-bulk.module.css'
import update from 'immutability-helper'
import ReactCreatableSelect from 'react-select/creatable'
import ReactSelect from 'react-select'

import {useContext, useEffect, useState} from 'react'
import tagApi from '../../../server-api/tag'
import assetApi from '../../../server-api/asset'
import projectApi from '../../../server-api/project'
import campaignApi from '../../../server-api/campaign'
import attributeApi from '../../../server-api/attribute'
import folderApi from '../../../server-api/folder'
import toastUtils from '../../../utils/toast'
import { Utilities } from '../../../assets'

// Contexts
import { AssetContext, FilterContext } from '../../../context'

import { getAssetsFilters } from '../../../utils/asset'


// Components
import Button from '../buttons/button'
import Tag from '../misc/tag'
import IconClickable from '../buttons/icon-clickable'
import ChannelSelector from '../items/channel-selector'
import CreatableSelect from '../inputs/creatable-select'
import ProjectCreationModal from '../modals/project-creation-modal'
import ProductAddition from '../asset/product-addition'
import ConfirmModal from '../modals/confirm-modal'
import CustomFieldSelector from "../items/custom-field-selector";


// Server DO NOT return full custom field slots including empty array, so we will generate empty array here
// The order of result should be match with order of custom field list
const mappingCustomFieldData = (list, valueList) => {
  let rs = []
  list.map((field)=>{
    let value = valueList.filter(valueField => valueField.id === field.id)

    if(value.length > 0){
      rs.push(value[0])
    }else{
      let customField = { ...field }
      customField.values = []
      rs.push(customField)
    }
  })

  return rs
}

const SidePanelBulk = ({
  elementsSelected,
  onUpdate,
  assetProjects,
  setAssetProjects,
  assetCampaigns,
  setCampaigns,
  assetTags,
  setTags,
  assetCustomFields,
  setCustomFields,
  originalInputs,
  setLoading,
  loading,
  addMode
}) => {

  const {
    activeFolder,
    selectedAllAssets,
  } = useContext(AssetContext)

  const { activeSortFilter, term } = useContext(FilterContext)

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

  // Custom fields
  const [inputCustomFields, setInputCustomFields] = useState([])
  const [activeCustomField, setActiveCustomField] = useState<number>()


  useEffect(() => {
    getInputData()
  }, [])

  useEffect(() => {
    if (addMode) {
      setAssetFolder(null)
      setChannel(null)
      setAssetProduct(null)
    }
  }, [addMode, originalInputs])

  const updateChannel = (option) => {
    setChannel(option)
  }

  const getInputData = async () => {
    try {
      const projectsResponse = await projectApi.getProjects()
      const campaignsResponse = await campaignApi.getCampaigns()
      const folderResponse = await folderApi.getFoldersSimple()
      const tagsResponse = await tagApi.getTags()
      const customFieldsResponse = await attributeApi.getCustomFields({isAll: 1, sort: 'createdAt,asc'})

      setInputProjects(projectsResponse.data)
      setInputCampaigns(campaignsResponse.data)
      setInputFolders(folderResponse.data)
      setInputTags(tagsResponse.data)
      setInputCustomFields(customFieldsResponse.data)
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
    setActiveDropdown('')
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
    let warningMessage
    if (addMode) {
      warningMessage = `Any channel, collection, or product added will replace the respective property from the (${elementsSelected.length}) selected assets`
    } else {
      warningMessage = `Are you sure you want to remove attributes from the (${elementsSelected.length}) selected assets?`
    }
    setWarningMessage(warningMessage)
  }

  const saveChanges = async () => {
    try {
      let filters = {}
      // Select all assets without pagination
      // Comment this because, deselect all then select single asset wont change selectedAllAssets status => it will update all assets
      // if(selectedAllAssets){
      //   console.log(`Select all`)
      //   filters = {
      //     ...getAssetsFilters({
      //       replace: false,
      //       activeFolder,
      //       addedIds: [],
      //       nextPage: 1,
      //       userFilterObject: activeSortFilter
      //     }),
      //     selectedAll: '1',
      //   };
      //
      //   if(term){
      //     // @ts-ignore
      //     filters.term = term;
      //   }
      //   // @ts-ignore
      //   delete filters.page
      // }

      setWarningMessage('')
      setLoading(true)
      const mapAttributes = ({ id, name }) => ({ id, name })

      // Parse custom field attributes
      const customFieldAttributes = (customFields) => {
        let values = []
        customFields.map((field)=>{
          values = values.concat(field.values)
        })

        return values

      }

      const campaigns = assetCampaigns.map(mapAttributes)
      const projects = assetProjects.map(mapAttributes)
      const tags = assetTags.map(mapAttributes)
      const customs = customFieldAttributes(assetCustomFields).map(mapAttributes)
      const updateObject = {
        assetIds: elementsSelected.map(({ asset: { id } }) => id),
        attributes: {}
      }

      if (addMode) {
        updateObject.attributes = {
          channel,
          folders: [],
          campaigns,
          projects,
          tags,
          customs,
          products: []
        }
        if (assetProduct) updateObject.attributes.products = [{ product: assetProduct, productTags: assetProduct.tags }]
        if (assetFolder) updateObject.attributes.folders = [{ name: assetFolder.name, id: assetFolder.id }]
      } else {
        updateObject.attributes = getRemoveAttributes({ campaigns, projects, tags })
      }

      await assetApi.updateMultipleAttributes(updateObject, filters)
      await onUpdate()
      toastUtils.success('Asset edits saved')
    } catch (err) {
      console.log(err)
      toastUtils.error('An error occurred, please try again later')
    } finally {
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
      <h2>{addMode ? 'Add Attributes to' : 'Remove Attributes from'} Selected Assets</h2>
      <section className={styles['first-section']}>
        <p>{`Editing (${elementsSelected.length}) files`}</p>
      </section>
      {addMode &&
        <section className={styles['field-wrapper']} >
          <div className={`secondary-text ${styles.field}`}>Channel</div>
          <ChannelSelector
            channel={channel || undefined}
            isShare={false}
            onLabelClick={() => { }}
            handleChannelChange={(option) => updateChannel(option)}
          />
        </section>
      }

      {addMode &&
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
      }

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
          onAddOperationFinished={() => setActiveDropdown('')}
          onRemoveOperationFinished={() => null}
          onOperationFailedSkipped={() => setActiveDropdown('')}
          asyncCreateFn={() => null}
          dropdownIsActive={activeDropdown === 'campaigns'}
          altColor='yellow'
          isShare={false}
          isBulkEdit={true}
          canAdd={addMode}
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
          onAddOperationFinished={() => setActiveDropdown('')}
          onRemoveOperationFinished={() => null}
          onOperationFailedSkipped={() => setActiveDropdown('')}
          asyncCreateFn={() => null}
          dropdownIsActive={activeDropdown === 'tags'}
          isShare={false}
          isBulkEdit={true}
          canAdd={addMode}
        />
      </section>

      {inputCustomFields.map((field, index)=>{
        if(field.type === 'selectOne'){
          return <div className={styles['field-wrapper']} >
            <div className={`secondary-text ${styles.field}`}>{field.name}</div>
            <CustomFieldSelector
                data={assetCustomFields[index]?.values[0]?.name}
                options={field.values}
                isShare={false}
                onLabelClick={() => { }}
                handleFieldChange={(option)=>{ setCustomFields(index, [option])}}
            />
          </div>
          // return <div className={styles['field-wrapper']} >
          //   <div className={`secondary-text ${styles.field}`}>{field.name}</div>
          //   <div className={'normal-text'}>
          //     <ul className={`tags-list ${styles['tags-list']}`}>
          //       {assetCustomFields[index]?.values?.map((value, valueIndex) => (
          //           <li key={value.id}>
          //             <Tag
          //                 altColor='turquoise'
          //                 tag={value.name}
          //                 canRemove={true}
          //                 removeFunction={() => {
          //                   let stateItemsUpdate = update(assetCustomFields[index]?.values, { $splice: [[valueIndex, 1]] })
          //                   setCustomFields(index, stateItemsUpdate)
          //                 }}
          //             />
          //           </li>
          //       ))}
          //     </ul>
          //     {activeCustomField === index ?
          //         <div className={`tag-select ${styles['select-wrapper']}`}>
          //           <ReactSelect
          //               options={field.values.map(customField => ({ ...customField, label: customField.name, value: customField.id }))}
          //               placeholder={'Select an existing one'}
          //               onChange={(selected, actionMeta)=>{
          //                 // onChangeSelectOneCustomField(selected, actionMeta, index)
          //                 setCustomFields(index, [selected])
          //               }
          //               }
          //               styleType={'regular item'}
          //               menuPlacement={'top'}
          //               isClearable={false}
          //           />
          //         </div>
          //         :
          //         <div className={`add ${styles['select-add']}`} onClick={() => setActiveCustomField(index)}>
          //           <IconClickable src={Utilities.add} />
          //           <span>{`Add ${field.name}`}</span>
          //         </div>
          //     }
          //   </div>
          // </div>
        }

        if(field.type === 'selectMultiple'){
          return <div className={styles['field-wrapper']} key={index}>
            <CreatableSelect
                creatable={false}
                title={field.name}
                addText={`Add ${field.name}`}
                onAddClick={() => setActiveCustomField(index)}
                selectPlaceholder={'Select an existing one'}
                avilableItems={field.values}
                isShare={false}
                setAvailableItems={()=>{}}
                selectedItems={(assetCustomFields.filter((assetField)=>assetField.id === field.id))[0]?.values || []}
                setSelectedItems={(data)=>{
                  setActiveCustomField(undefined)
                  setCustomFields(index, data)
                }
                }
                onAddOperationFinished={(stateUpdate) => {
                }}
                onRemoveOperationFinished={async (index, stateUpdate, removeId) => {
                  setCustomFields(index, stateUpdate)
                }}
                onOperationFailedSkipped={() => setActiveCustomField(undefined)}
                asyncCreateFn={() => null}
                dropdownIsActive={activeCustomField === index}
                isBulkEdit={true}
                canAdd={addMode}
            />
          </div>
        }
      })}

      {/*<section className={styles['field-wrapper']} >*/}
      {/*  <div className={`secondary-text ${styles.field}`}>Projects</div>*/}
      {/*  <div className={'normal-text'}>*/}
      {/*    <ul className={`tags-list ${styles['tags-list']}`}>*/}
      {/*      {assetProjects?.map((project, index) => (*/}
      {/*        <li key={project.id}>*/}
      {/*          <Tag*/}
      {/*            altColor='turquoise'*/}
      {/*            tag={project.name}*/}
      {/*            canRemove={true}*/}
      {/*            removeFunction={() => removeProject(index)}*/}
      {/*          />*/}
      {/*        </li>*/}
      {/*      ))}*/}
      {/*    </ul>*/}
      {/*    {addMode &&*/}
      {/*      <>*/}
      {/*        {activeDropdown === 'projects' ?*/}
      {/*          <div className={`tag-select ${styles['select-wrapper']}`}>*/}
      {/*            <ReactCreatableSelect*/}
      {/*              options={inputProjects.map(project => ({ ...project, label: project.name, value: project.id }))}*/}
      {/*              placeholder={'Enter new project or select an existing one'}*/}
      {/*              onChange={handleProjectChange}*/}
      {/*              styleType={'regular item'}*/}
      {/*              menuPlacement={'top'}*/}
      {/*              isClearable={true}*/}
      {/*            />*/}
      {/*          </div>*/}
      {/*          :*/}
      {/*          <div className={`add ${styles['select-add']}`} onClick={() => setActiveDropdown('projects')}>*/}
      {/*            <IconClickable src={Utilities.add} />*/}
      {/*            <span>Add to Project</span>*/}
      {/*          </div>*/}
      {/*        }*/}
      {/*      </>*/}
      {/*    }*/}
      {/*  </div>*/}
      {/*</section>*/}

      {addMode &&
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
      }

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
        modalIsOpen={warningMessage}
      />
    </div >
  )
}

export default SidePanelBulk
