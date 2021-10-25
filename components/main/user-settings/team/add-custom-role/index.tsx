import styles from './index.module.css'
import {useContext, useEffect, useState} from "react"
import update from "immutability-helper";

import Input from "../../../../common/inputs/input";
import Button from "../../../../common/buttons/button";
import IconClickable from "../../../../common/buttons/icon-clickable";

import { Utilities } from '../../../../../assets'
import CreatableSelect from "../../../../common/inputs/creatable-select";

// Contexts
import { FilterContext } from '../../../../../context'
import CustomFieldSelector from "../../../../common/items/custom-field-selector";

import customFieldsApi from '../../../../../server-api/attribute'
import permissionApi from '../../../../../server-api/permission'
import folderApi from '../../../../../server-api/folder'
import campaignApi from '../../../../../server-api/campaign'
import teamApi from '../../../../../server-api/team'
import MemberPermissions from "../member-permissions";
import SpinnerOverlay from "../../../../common/spinners/spinner-overlay";
import ReactTooltip from "react-tooltip";

// Server DO NOT return full custom field slots including empty array, so we will generate empty array here
// The order of result should be match with order of custom field list
const mappingCustomFieldData = (list, valueList) => {
    let rs = []
    list.map((field)=>{
        let value = valueList.filter(valueField => valueField.id === field.id)

        if(value.length > 0){
            field.required = value[0].required;
            rs.push(value[0])
        }else{
            let customField = { ...field }
            customField.required = true; // Default is true
            customField.values = []
            rs.push(customField)
        }
    })

    return rs
}

const AddCustomRole = ({ onSave, role }) => {

    const { loadCampaigns, loadProjects, loadTags } = useContext(FilterContext)

    const [mode, setMode] = useState('customRestriction') // Available options: customRestriction, permission
    const [activeDropdown, setActiveDropdown] = useState('')

    const [name, setName] = useState('')

    const [collections, setCollections] = useState([])
    const [selectedCollections, setSelectedCollection] = useState([])

    const [campaigns, setCampaigns] = useState([])
    const [selectedCampaigns, setSelectedCampaigns] = useState([])

    const [activeCustomField, setActiveCustomField] = useState<number>()
    const [inputCustomFields, setInputCustomFields] = useState([])
    const [assetCustomFields, setAssetCustomFields] = useState(mappingCustomFieldData(inputCustomFields, []))


    const [permissions, setPermissions] = useState([])
    const [selectedPermissions, setSelectedPermissions] = useState([])

    const [roleConfigs, setRoleConfigs] = useState({
        andMainField: true,
        andCustomAttribute: true
    })

    const [loading, setLoading] = useState(true)

    const getCustomFieldsInputData = async () => {
        try {
            const { data } = await customFieldsApi.getCustomFields({isAll: 1, sort: 'createdAt,asc'})

            setInputCustomFields(data)

            return data;

        } catch (err) {
            // TODO: Maybe show error?
        }
    }

    // On change custom fields (add/remove)
    const onChangeCustomField = (index, data) => {
        // Show loading
        // setIsLoading(true)

        // Hide select list
        setActiveCustomField(undefined)


        // Update asset custom field (local)
        setAssetCustomFields(update(assetCustomFields, {
            [index]: {
                values: {$set: data}
            }
        }))

        // Show loading
        // setIsLoading(false)
    }


    // On custom field select one changes
    const onChangeSelectOneCustomField = async (selected, index) => {
        console.log(selected)
        // Show loading
        // setIsLoading(true)

        // Call API to add custom fields
        // await assetApi.addCustomFields(id, selected)

        // Hide select list
        setActiveCustomField(undefined)

        // Update asset custom field (local)
        setAssetCustomFields(update(assetCustomFields, {
            [index]: {
                values: {$set: [selected]}
            }
        }))

        // Hide loading
        // setIsLoading(false)
    }

    const getFolders = async() => {
        const { data } =  await folderApi.getFoldersSimple();
        setCollections(data)
        return data
    }

    const getCampaigns = async() => {
        const { data } = await campaignApi.getCampaigns({ stage: 'draft', assetLim: 'yes'});
        setCampaigns(data)
        return data
    }

    const getPermissions = async () => {
        try {
            const { data } = await permissionApi.getPermissions()
            setPermissions(data)

            // In default, all permission will be selected
            setSelectedPermissions(data)
            return data
        } catch (err) {
            console.log(err)
        }
    }

    const getDefaultValue = async (inputCustomFields) => {
        if(role){
            const { data } = await teamApi.getRoleDetail(role)
            setSelectedCollection(data.folders)
            setSelectedCampaigns(data.campaigns)
            setSelectedPermissions(data.permissions)
            setName(data.name)

            if(data.configs?.configs){
                setRoleConfigs(JSON.parse(data.configs?.configs))
            }

            const updatedMappingCustomFieldData =  mappingCustomFieldData(inputCustomFields, data.customs)

            setAssetCustomFields(update(assetCustomFields, {
                $set: updatedMappingCustomFieldData
            }))

        }else{

        }
    }

    const getAll = async() => {
        const [folderData, permissionData, inputCustomFieldsData] = await Promise.all([getFolders(),  getPermissions(),  getCustomFieldsInputData(), getCampaigns()])
        await getDefaultValue(inputCustomFieldsData)
        setLoading(false)
    }

    const onSubmit = async () => {
        setLoading(true)
        let customFieldValueIds = [];

        assetCustomFields.map((field)=>{
            customFieldValueIds = customFieldValueIds.concat(field.values.map((value)=>value.id))
        })


        // Update
        if(role){
            await teamApi.editRole(role,{
                name,
                collections: selectedCollections.map((collection)=>collection.id),
                campaigns: selectedCampaigns.map((campaign)=>campaign.id),
                customFieldValues: customFieldValueIds,
                permissions: selectedPermissions.map((permission)=>permission.id),
                configs: roleConfigs
            })
        }else{ // Create new one
            await teamApi.createCustomRole({
                name,
                collections: selectedCollections.map((collection)=>collection.id),
                campaigns: selectedCampaigns.map((campaign)=>campaign.id),
                customFieldValues: customFieldValueIds,
                permissions: selectedPermissions.map((permission)=>permission.id),
                configs: roleConfigs
            })
        }


        setLoading(false)

        onSave()
    }

    // Check to decide with radio button is selected
    const isCustomAttributesRequired = (config, id) => {
        if(config[id] !== undefined){
            return config[id]
        }else{
            return true // Default is true
        }
    }

    const updateRoleConfigs = (name, value) => {
        const currentRoleConfigs = {...roleConfigs}
        currentRoleConfigs[name] = value
        setRoleConfigs(currentRoleConfigs)
    }

    useEffect(() => {
        getAll();
    }, [])

    useEffect(()=>{
        if(inputCustomFields.length > 0){
            const updatedMappingCustomFieldData =  mappingCustomFieldData(inputCustomFields, [])

            setAssetCustomFields(update(assetCustomFields, {
                $set: updatedMappingCustomFieldData
            }))

            // updateAssetState({
            //     customs: {$set: updatedMappingCustomFieldData}
            // })
        }
    },[inputCustomFields])


  return (
      <div>
        <h3>Role</h3>

        <div className={'row align-center'}>
          <div className={'col-50'}>
            <Input
                name={'name'}
                value={name}
                onChange={(e)=>{setName(e.target.value)}}
                placeholder={'Role name'}
                type={'text'}
                styleType={'regular-short'} />
          </div>
          {/*<div className={'col-50'}>*/}
          {/*  <Button*/}
          {/*      styleTypes={['exclude-min-height']}*/}
          {/*      type={'button'}*/}
          {/*      text='Save'*/}
          {/*      styleType='primary'*/}
          {/*  />*/}
          {/*</div>*/}
        </div>

          <div className={styles['field-content']}>
              <div className={styles['field-radio-wrapper']}>
                  <div className={`${styles['radio-button-wrapper']} m-r-30`}>
                      <div className={'m-r-15 font-weight-600'}>Custom Restrictions</div>
                      <IconClickable
                          src={mode === 'customRestriction' ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
                          additionalClass={styles['select-icon']}
                          onClick={() => setMode('customRestriction')} />
                  </div>
                  <div className={`${styles['radio-button-wrapper']}`}>
                      <div className={'m-r-15 font-weight-600'}>Permissions</div>
                      <IconClickable
                          src={mode === 'permission' ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
                          additionalClass={styles['select-icon']}
                          onClick={() => setMode('permission')} />
                  </div>
              </div>
          </div>

          {mode === 'customRestriction' && <div className={styles['role-config-content']}>
              <div className={styles['field-radio-wrapper']}>
                  <div className={`${styles['radio-button-wrapper']} m-r-30`} data-tip data-for={'require-all-main'}>
                      <div className={'m-r-15 font-12'}>Require All</div>
                      <IconClickable
                          src={roleConfigs.andMainField ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
                          additionalClass={styles['select-icon']}
                          onClick={() => {updateRoleConfigs('andMainField', true)}} />
                  </div>

                  <ReactTooltip place={'bottom'} id={'require-all-main'} delayShow={300} effect='solid'>{'Require all these following fields'}</ReactTooltip>
                  <div className={`${styles['radio-button-wrapper']}`}  data-tip data-for={'require-any-main'}>
                      <div className={'m-r-15 font-12'}>Require Any</div>
                      <IconClickable
                          src={!roleConfigs.andMainField ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
                          additionalClass={styles['select-icon']}
                          onClick={() => {updateRoleConfigs('andMainField', false)}} />
                  </div>
                  <ReactTooltip place={'bottom'} id={'require-any-main'} delayShow={300} effect='solid'>{'Require at least 1 of these following fields'}</ReactTooltip>
              </div>
          </div>}

          {mode === 'customRestriction' && <div className={'m-l-30 m-t-30'}>
              <span className={styles['field-title']} >Collections</span>
              <div className={styles['field-wrapper']} >
                  <CreatableSelect
                      creatable={false}
                      title=''
                      addText='Add Collections'
                      onAddClick={() => setActiveDropdown('collections')}
                      selectPlaceholder={'Select an existing one'}
                      avilableItems={collections}
                      setAvailableItems={setCollections}
                      selectedItems={selectedCollections}
                      setSelectedItems={setSelectedCollection}
                      onAddOperationFinished={(stateUpdate) => {
                          // console.log('here2')
                          // updateAssetState({
                          //     tags: { $set: stateUpdate }
                          // })
                          // loadTags()
                      }}
                      onRemoveOperationFinished={async (index, stateUpdate) => {
                          // await assetApi.removeTag(id, assetTags[index].id)
                          // updateAssetState({
                          //     tags: { $set: stateUpdate }
                          // })
                      }}
                      onOperationFailedSkipped={() => setActiveDropdown('')}
                      isShare={false}
                      asyncCreateFn={(newItem) => {return true}}
                      dropdownIsActive={activeDropdown === 'collections'}
                  />
              </div>

              <span className={styles['field-title']} >Custom Fields</span>
              <div className={styles['role-config-content']}>
                  <div className={styles['field-radio-wrapper']}>
                      <div className={`${styles['radio-button-wrapper']} m-r-30`} data-tip data-for={'require-all-custom'}>
                          <div className={'m-r-15 font-12'}>Require All</div>
                          <IconClickable
                              src={roleConfigs.andCustomAttribute ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
                              additionalClass={styles['select-icon']}
                              onClick={() => {updateRoleConfigs('andCustomAttribute', true)}} />
                      </div>
                      <ReactTooltip place={'bottom'} id={'require-all-custom'} delayShow={300} effect='solid'>{'Require all these following fields'}</ReactTooltip>
                      <div className={`${styles['radio-button-wrapper']}`} data-tip data-for={'require-any-custom'}>
                          <div className={'m-r-15 font-12'}>Require Any</div>
                          <IconClickable
                              src={!roleConfigs.andCustomAttribute ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal}
                              additionalClass={styles['select-icon']}
                              onClick={() => {updateRoleConfigs('andCustomAttribute', false)}} />
                      </div>
                      <ReactTooltip place={'bottom'} id={'require-any-custom'} delayShow={300} effect='solid'>{'Require at least 1 of these following fields'}</ReactTooltip>
                  </div>
              </div>
              <div className={styles['custom-field-wrapper']}>
                  {inputCustomFields.map((field, index)=>{
                      if(field.type === 'selectOne'){

                          return <div className={styles['custom-field-row']} >
                              <div className={`secondary-text ${styles.field}`}>{field.name}</div>
                              <CustomFieldSelector
                                  data={assetCustomFields[index]?.values[0]?.name}
                                  options={field.values}
                                  isShare={false}
                                  onLabelClick={() => { }}
                                  handleFieldChange={(option)=>{onChangeSelectOneCustomField(option, index)}}
                              />
                          </div>
                      }

                      if(field.type === 'selectMultiple'){
                          return <div className={styles['custom-field-row']} key={index}>
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
                                      // updateAssetState({
                                      //     customs: {[index]: {values: { $set: stateUpdate }}}
                                      // })
                                  }}
                                  onRemoveOperationFinished={async (index, stateUpdate, removeId) => {
                                      // setIsLoading(true);

                                      // await assetApi.removeCustomFields(id, removeId)

                                      // updateAssetState({
                                      //     customs: {[index]: {values: { $set: stateUpdate }}}
                                      // })
                                      //
                                      // setIsLoading(false);
                                  }}
                                  onOperationFailedSkipped={() => setActiveCustomField(undefined)}
                                  isShare={false}
                                  asyncCreateFn={(newItem) => { // Show loading
                                      return true;
                                      // setIsLoading(true); return assetApi.addCustomFields(id, newItem)
                                  }
                                  }
                                  dropdownIsActive={activeCustomField === index}
                              />
                          </div>
                      }
                  })}
              </div>


              <span className={styles['field-title']} >Campaigns</span>
              <div className={styles['field-wrapper']} >
                  <CreatableSelect
                      creatable={false}
                      title=''
                      addText='Add Campaigns'
                      onAddClick={() => setActiveDropdown('campaigns')}
                      selectPlaceholder={'Select an existing one'}
                      avilableItems={campaigns}
                      setAvailableItems={setCampaigns}
                      selectedItems={selectedCampaigns}
                      setSelectedItems={setSelectedCampaigns}
                      onAddOperationFinished={(stateUpdate) => {
                          // console.log('here2')
                          // updateAssetState({
                          //     tags: { $set: stateUpdate }
                          // })
                          // loadTags()
                      }}
                      onRemoveOperationFinished={async (index, stateUpdate) => {
                          // await assetApi.removeTag(id, assetTags[index].id)
                          // updateAssetState({
                          //     tags: { $set: stateUpdate }
                          // })
                      }}
                      onOperationFailedSkipped={() => setActiveDropdown('')}
                      isShare={false}
                      asyncCreateFn={(newItem) => {return true}}
                      dropdownIsActive={activeDropdown === 'campaigns'}
                      altColor='yellow'
                  />
              </div>
          </div>}


          {mode === 'permission' && <MemberPermissions memberPermissions={selectedPermissions}
                             listOnly={true}
                             permissions={permissions} setMemberPermissions={setSelectedPermissions} />}

          <div className={'row justify-center'}>
              <Button
                  styleTypes={['exclude-min-height']}
                  type={'button'}
                  text='Save'
                  styleType='primary'
                  onClick={onSubmit}
                  disabled={!name}
              />
          </div>


          {loading && <SpinnerOverlay />}

      </div>
  )
}

export default AddCustomRole
