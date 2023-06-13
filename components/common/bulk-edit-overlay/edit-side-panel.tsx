// External
import _ from "lodash"
import styles from '../../common/asset/detail-side-panel.module.css'
import update from 'immutability-helper'
import ReactCreatableSelect from 'react-select/creatable'
import ReactSelect from 'react-select'
import { useEffect, useState, useContext } from 'react'
import { format } from 'date-fns'
import { capitalCase } from 'change-case'
import filesize from 'filesize'

// APIs
import tagApi from '../../../server-api/tag'
import customFieldsApi from '../../../server-api/attribute'
import assetApi from '../../../server-api/asset'
import projectApi from '../../../server-api/project'
import campaignApi from '../../../server-api/campaign'
import folderApi from '../../../server-api/folder'

// Contexts
import { AssetContext, UserContext, FilterContext, LoadingContext } from '../../../context'

// Utils
import { getParsedExtension } from '../../../utils/asset'
import { Utilities } from '../../../assets'
import channelSocialOptions from '../../../resources/data/channels-social.json'
import {
  CALENDAR_ACCESS
} from '../../../constants/permissions'

// Components
import Tag from '../misc/tag'
import IconClickable from '../buttons/icon-clickable'
import ChannelSelector from '../items/channel-selector'
import CustomFieldSelector from "../items/custom-field-selector"
import CreatableSelect from '../inputs/creatable-select'
import ProjectCreationModal from '../modals/project-creation-modal'
import ProductAddition from '../../common/asset/product-addition'

// Constants
import { ASSET_EDIT } from '../../../constants/permissions'
import Button from "../buttons/button"

const sort = (data) => {
  return _.orderBy(data, [item => (item.name || "")?.toLowerCase()],['asc']);
}

// Server DO NOT return full custom field slots including empty array, so we will generate empty array here
// The order of result should be match with order of custom field list
const mappingCustomFieldData = (list, valueList) => {
  let rs = []
  list.map((field)=>{
    let value = valueList?.filter(valueField => valueField.id === field.id)

    if(value?.length > 0){
      value[0].values = sort(value[0].values);
      rs.push(value[0])
    }else{
      let customField = { ...field }
      customField.values = []
      rs.push(customField)
    }
  })

  return rs
}

const EditSidePanel = ({ asset, updateAsset, setAssetDetail, isShare }) => {
  const {
    id,
    createdAt,
    fileModifiedAt,
    type,
    extension,
    dimension,
    size,
    tags,
    campaigns,
    projects,
    channel,
    product,
    products,
    folder,
    folders,
    customs,
    dpi
  } = asset

  const { assets, setAssets, activeFolder } = useContext(AssetContext)

  const { hasPermission, advancedConfig } = useContext(UserContext)
  const { loadCampaigns, loadProjects, loadTags } = useContext(FilterContext)

  const [hideFilterElements] = useState(advancedConfig.hideFilterElements)

  const { setIsLoading }  = useContext(LoadingContext)

  const [inputCampaigns, setInputCampaigns] = useState([])
  const [availNonAiTags, setAvailNonAiTags] = useState([])
  const [availAiTags, setAvailAiTags] = useState([])
  const [inputProjects, setInputProjects] = useState([])
  const [inputFolders, setInputFolders] = useState([])

  const [nonAiTags, setNonAiTags] = useState([])
  const [aiTags, setAiTags] = useState([])
  const [assetCampaigns, setCampaigns] = useState(campaigns)
  const [assetProjects, setProjects] = useState(projects)
  const [selectedFolder, setSelectedFolders] = useState([])

  const [activeDropdown, setActiveDropdown] = useState('')

  const [newProjectName, setNewProjectName] = useState('')

  // Custom fields
  const [activeCustomField, setActiveCustomField] = useState<number>()
  const [inputCustomFields, setInputCustomFields] = useState([])
  const [assetCustomFields, setAssetCustomFields] = useState(mappingCustomFieldData(inputCustomFields, customs))

  // Products
  const [productList, setProductList] = useState(products)

  useEffect(() => {
    const _nonAiTags = (tags || []).filter(tag => tag.type !== 'AI')
    const _aiTags = (tags || []).filter(tag => tag.type === 'AI')
    setNonAiTags(sort(_nonAiTags))
    setAiTags(sort(_aiTags))
    setCampaigns(sort(campaigns))
    setProjects(projects)
    setSelectedFolders(folders)

    // setAssetCustomFields(update(assetCustomFields, {
    //   $set: mappingCustomFieldData(inputCustomFields, customs)
    // }))

  }, [asset])

  useEffect(() => {
    if (!isShare) {
      getTagsInputData()
      getCustomFieldsInputData()
      getFolderData()
      if (hasPermission([CALENDAR_ACCESS])) {
        getInputData()
        getCustomFieldsInputData()
      }
    }
  }, [])


  useEffect(()=>{
    if(inputCustomFields.length > 0){
      const updatedMappingCustomFieldData =  mappingCustomFieldData(inputCustomFields, customs)

      setAssetCustomFields(update(assetCustomFields, {
        $set: updatedMappingCustomFieldData
      }))

      updateAssetState({
        customs: {$set: updatedMappingCustomFieldData}
      })
    }
  },[inputCustomFields])


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

  const getFolderData = async () => {
    const folderResponse = await folderApi.getFoldersSimple()
    setInputFolders(folderResponse.data)
  }

  const getTagsInputData = async () => {
    try {
      const tagsResponse = await tagApi.getTags({includeAi: true})
      const regTags = tagsResponse.data.filter(tag => tag.type !== 'AI')
      const aiTags = tagsResponse.data.filter(tag => tag.type === 'AI')
      setAvailNonAiTags(regTags)
      setAvailAiTags(aiTags)
    } catch (err) {
      // TODO: Maybe show error?
    }
  }

  const getCustomFieldsInputData = async () => {
    try {
      const { data } = await customFieldsApi.getCustomFields({isAll: 1, sort: 'createdAt,asc'})

      setInputCustomFields(data)

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
    if (assetIndex >= 0) {
      setAssets(update(assets, {
        [assetIndex]: {
          asset: updatedata
        }
      }))
      setAssetDetail(update(asset, updatedata))
    }

    setActiveDropdown('')
  }

  const handleProjectChange = async (selected, actionMeta) => {
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
    const [width, height] = dimension.split(',')
    if(!isNaN(width) || !isNaN(height)) {
      formattedDimension = `${width} x  ${height} px`
    }
  }

  let formattedDPI
  if(dpi !== 0){
    formattedDPI = dpi +" DPI"
  }else{
    formattedDPI = ""
  }

  const fieldValues = [
    {
      field: 'Last Updated',
      value: fileModifiedAt? format(new Date(fileModifiedAt), 'P'):''
    },
    {
      field: 'Uploaded',
      value: format(new Date(createdAt), 'P')
    },
    // {
    //   field: 'Type',
    //   value: capitalCase(type)
    // },
    {
      field: 'Extension',
      value: getParsedExtension(extension)
    },
    {
      field: 'Resolution',
      value: formattedDPI
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

  const onValueChange = (selected, actionMeta, createFn, changeFn) => {
    if (actionMeta.action === 'create-option') {
      createFn(selected.value)
    } else {
      changeFn(selected)
    }
  }

  const addFolder = async (folderData) => {
    try {
      // Show loading
      setIsLoading(true)
      const rs = await assetApi.addFolder(id, folderData)

      setIsLoading(false)

      return rs
      // console.log(newFolder)
      // changeFolderState(newFolder)
      //
      // // Create the new one
      // if(!folderData.id){
      //   setInputFolders(update(inputFolders, { $push: [newFolder] }))
      // }

      // return newFolder

    } catch (err) {
      console.log(err)
    }
  }

  const deleteFolder = async (folderId, stateUpdate) => {
    try {
      // Show loading
      setIsLoading(true)
      await assetApi.removeFolder(id, folderId)
      // Show loading
      setIsLoading(false)
      changeFolderState(stateUpdate)
    } catch (err) {
      console.log(err)
    }
  }

  const changeFolder = async (product) => {
    try {
      await assetApi.addFolder(id, { id: product.id })
      changeFolderState(product)
    } catch (err) {
      console.log(err)
    }
  }

  const changeFolderState = (folders) => {
    let stateUpdate = {
      folders: { $set: folders }
    }
    // if (!folder) {
    //   stateUpdate = {
    //     folderId: { $set: undefined },
    //     folder: { $set: undefined }
    //   }
    // } else {
    //   stateUpdate = {
    //     folderId: { $set: folder.id },
    //     folder: { $set: folder }
    //   }
    // }
    updateAssetState(stateUpdate)
  }

  // On change custom fields (add/remove)
  const onChangeCustomField = (index, data) => {
    // Show loading
    setIsLoading(true)

    // Hide select list
    setActiveCustomField(undefined)


    // Update asset custom field (local)
    setAssetCustomFields(update(assetCustomFields, {
      [index]: {
        values: {$set: data}
      }
    }))

    // Show loading
    setIsLoading(false)
  }

  // On custom field select one changes
  const onChangeSelectOneCustomField = async (selected, index) => {
    // console.log(selected)
    // Show loading
    setIsLoading(true)

    // Call API to add custom fields
    await assetApi.addCustomFields(id, {...selected, folderId: activeFolder})

    // Hide select list
    setActiveCustomField(undefined)

    // Update asset custom field (local)
    setAssetCustomFields(update(assetCustomFields, {
      [index]: {
        values: {$set: [selected]}
      }
    }))

    // Hide loading
    setIsLoading(false)
  }

  // On remove select one custom field

  const onRemoveSelectOneCustomField = async (removeId, index, stateUpdate) => {
    // Show loading
    setIsLoading(true)

    await assetApi.removeCustomFields(id, removeId)

    // Update asset custom field (local)
    setAssetCustomFields(update(assetCustomFields, {
      [index]: {
        values: {$set: stateUpdate}
      }
    }))

    // Update asset (global)
    updateAssetState({
      customs: {[index]: {values: { $set: stateUpdate }}}
    })

    // Hide loading
    setIsLoading(false)
  }

  const addProductBlock = () => {
    setProductList([...productList, null])
  }

  useEffect(()=>{
    setProductList(products)
  },[products])


  return (
    <div className={` ${!isShare ? styles.fieldWrapper : styles.shareWrapper}`}>

      {!hideFilterElements.campaigns &&
      <div className={styles['field-wrapper']} >
        <CreatableSelect
          title='Campaigns'
          addText='Add to Campaign'
          onAddClick={() => setActiveDropdown('campaigns')}
          selectPlaceholder={'Enter a new campaign or select an existing one'}
          avilableItems={inputCampaigns}
          setAvailableItems={setInputCampaigns}
          selectedItems={assetCampaigns}
          setSelectedItems={(value)=>{
            setIsLoading(false)
            setCampaigns(value)
          }}
          onAddOperationFinished={(stateUpdate) => {
            updateAssetState({
              campaigns: { $set: stateUpdate }
            })
            loadCampaigns()
          }}
          onRemoveOperationFinished={async (index, stateUpdate) => {
            setIsLoading(true);

            await assetApi.removeCampaign(id, assetCampaigns[index].id)
            updateAssetState({
              campaigns: { $set: stateUpdate }
            })

            setIsLoading(false);
          }}
          onOperationFailedSkipped={() => setActiveDropdown('')}
          isShare={isShare}
          asyncCreateFn={(newItem) => {
            setIsLoading(true);
            return assetApi.addCampaign(id, newItem)
          }}
          dropdownIsActive={activeDropdown === 'campaigns'}
          altColor='yellow'
        />
      </div>}

      <div className={styles['field-wrapper']} >
        <CreatableSelect
          title='Tags'
          addText='Add Tags'
          onAddClick={() => setActiveDropdown('tags')}
          selectPlaceholder={'Enter a new tag or select an existing one'}
          avilableItems={availNonAiTags}
          setAvailableItems={setAvailNonAiTags}
          selectedItems={nonAiTags}
          setSelectedItems={(value)=>{
            setIsLoading(false)
            setNonAiTags(value)}
        }
          onAddOperationFinished={(stateUpdate) => {
            updateAssetState({
              tags: { $set: stateUpdate.concat(aiTags) }
            })
            loadTags()
          }}
          onRemoveOperationFinished={async (index, stateUpdate) => {
            setIsLoading(true);

            await assetApi.removeTag(id, nonAiTags[index].id)
            updateAssetState({
              tags: { $set: stateUpdate.concat(aiTags) }
            })

            setIsLoading(false);
          }}
          onOperationFailedSkipped={() => setActiveDropdown('')}
          isShare={isShare}
          asyncCreateFn={(newItem) => {
            setIsLoading(true);
            return assetApi.addTag(id, {...newItem, type: 'regular'})
          }}
          dropdownIsActive={activeDropdown === 'tags'}
          sortDisplayValue={true}
        />
      </div>

      {advancedConfig.aiTagging && ['png', 'jpg', 'jpeg'].indexOf(asset.extension.toLowerCase()) > -1 &&
      <div className={styles['field-wrapper']} >
        <CreatableSelect
          title='AI Tags'
          addText='Add AI Tags'
          type='AI'
          creatable = {false}
          onAddClick={() => setActiveDropdown('ai-tags')}
          selectPlaceholder={'Select an existing one'}
          avilableItems={availAiTags}
          setAvailableItems={setAvailNonAiTags}
          selectedItems={aiTags}
          setSelectedItems={(value)=>{
            setIsLoading(false)
            setAiTags(value)
          }}
          onAddOperationFinished={(stateUpdate) => {
            updateAssetState({
              tags: { $set: stateUpdate.concat(nonAiTags) }
            })
            loadTags()
          }}
          onRemoveOperationFinished={async (index, stateUpdate) => {
            setIsLoading(true);

            await assetApi.removeTag(id, aiTags[index].id)
            updateAssetState({
              tags: { $set: stateUpdate.concat(nonAiTags) }
            })

            setIsLoading(false);
          }}
          onOperationFailedSkipped={() => setActiveDropdown('')}
          isShare={isShare}
          asyncCreateFn={(newItem) => {
            setIsLoading(true);

            return assetApi.addTag(id, {...newItem, type: 'AI'})}
        }
          dropdownIsActive={activeDropdown === 'ai-tags'}
          sortDisplayValue={true}
        />
      </div>
      }

      {inputCustomFields.map((field, index)=>{
        if(field.type === 'selectOne'){

          return <div className={`${styles['field-wrapper']} ${styles['cus-dropdown']}`} key={index}>
            <div className={`secondary-text ${styles.field}`}>{field.name}</div>
            <CustomFieldSelector
                data={assetCustomFields[index]?.values[0]?.name}
                options={field.values}
                isShare={isShare}
                onLabelClick={() => { }}
                handleFieldChange={(option)=>{onChangeSelectOneCustomField(option, index)}}
            />
          </div>
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
                setAvailableItems={()=>{}}
                selectedItems={(assetCustomFields.filter((assetField)=>assetField.id === field.id))[0]?.values || []}
                setSelectedItems={(data)=>{onChangeCustomField(index, data)}}
                onAddOperationFinished={(stateUpdate) => {
                  updateAssetState({
                    customs: {[index]: {values: { $set: stateUpdate }}}
                  })
                }}
                onRemoveOperationFinished={async (index, stateUpdate, removeId) => {
                  setIsLoading(true);

                  await assetApi.removeCustomFields(id, removeId)

                  updateAssetState({
                    customs: {[index]: {values: { $set: stateUpdate }}}
                  })

                  setIsLoading(false);
                }}
                onOperationFailedSkipped={() => setActiveCustomField(undefined)}
                isShare={isShare}
                asyncCreateFn={(newItem) => { // Show loading
                  setIsLoading(true); return assetApi.addCustomFields(id, {...newItem, folderId: activeFolder})}}
                dropdownIsActive={activeCustomField === index}
                sortDisplayValue={true}
            />
          </div>
        }
      })}


      <div className={styles['field-wrapper']} >
        <CreatableSelect
            title='Collections'
            addText='Add to Collections'
            onAddClick={() => setActiveDropdown('collections')}
            selectPlaceholder={'Enter a new collection or select an existing one'}
            avilableItems={inputFolders}
            setAvailableItems={setInputFolders}
            selectedItems={selectedFolder}
            setSelectedItems={setSelectedFolders}
            onAddOperationFinished={(stateUpdate) => {
              // console.log(stateUpdate)
              updateAssetState({
                folders: { $set: stateUpdate }
              })
              // loadCampaigns()
            }}
            onRemoveOperationFinished={async (index, stateUpdate, id) => {
              deleteFolder(id, stateUpdate)
              // return deleteFolder(index)
              // await assetApi.removeCampaign(id, assetCampaigns[index].id)
              // updateAssetState({
              //   campaigns: { $set: stateUpdate }
              // })
            }}
            onOperationFailedSkipped={() => setActiveDropdown('')}
            isShare={isShare}
            asyncCreateFn={(newItem)=>{ return addFolder(newItem)}}
            dropdownIsActive={activeDropdown === 'collections'}
            altColor='yellow'
            sortDisplayValue={true}
        />
      </div>

      { !hideFilterElements.products &&
      <>
        <div className={styles['field-wrapper']} >
          <div className={`secondary-text ${styles.field}`}>Products</div>
        </div>

        {productList && productList.map((product, index)=>{
          return <div className={styles['product-wrapper']} key={index}>
            <ProductAddition
                noTitle
                skuActiveDropdownValue={`sku-${index}`}
                productFieldActiveDropdownValue={`product_field-${index}`}
                productVendorActiveDropdownValue={`product_vendor-${index}`}
                productCategoryActiveDropdownValue={`product_category-${index}`}
                productRetailerActiveDropdownValue={`product_retailer-${index}`}
                FieldWrapper={({ children }) => (
                    <div className={styles['field-wrapper']} >{children}</div>
                )}
                isShare={isShare || !hasPermission([ASSET_EDIT])}
                activeDropdown={activeDropdown}
                setActiveDropdown={(value)=>{console.log(value);setActiveDropdown(`${value}-${index}`)}}
                assetId={id}
                onAdd={(item) => {
                  let arr = [...products]
                  arr.push(item)
                  updateAssetState({
                    products: { $set: arr }
                  })
                }}
                onDelete={() => {
                  let arr = [...products]
                  arr.splice(index, 1)
                  updateAssetState({
                    products: { $set: arr }
                  })
                }}
                // updateAssetState={updateAssetState}
                product={product}
            />
          </div>
        })}



        {!isShare && hasPermission([ASSET_EDIT]) && <div className={`add ${styles['select-add']}`} onClick={addProductBlock}>
          <IconClickable src={Utilities.add} />
          <span className={"normal-text"}>Add Product</span>
        </div>}

        <ProjectCreationModal
          initialValue={newProjectName}
          closeModal={() => setNewProjectName('')}
          confirmCreation={addNewProject}
          modalIsOpen={newProjectName ? true : false}
        />
      </>}

      <div className={styles['save-submodal-btn']}>
          <Button text={'Save Changes'} type={'button'} styleType={'primary'} />
      </div>
    </div >
  )
}

export default EditSidePanel
