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
import MemberPermissions from "../member-permissions";

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

const AddCustomRole = ({ onSave }) => {

    const { loadCampaigns, loadProjects, loadTags } = useContext(FilterContext)

    const [mode, setMode] = useState('customRestriction') // Available options: customRestriction, permission
    const [activeDropdown, setActiveDropdown] = useState('')

    const [collections, setCollections] = useState([{name: 'A', id: 1}, { name: 'B', id: 2}])
    const [selectedCollections, setSelectedCollection] = useState([])

    const [campaigns, setCampaigns] = useState([{name: 'A', id: 1}, { name: 'B', id: 2}])
    const [selectedCampaigns, setSelectedCampaigns] = useState([])

    const [activeCustomField, setActiveCustomField] = useState<number>()
    const [inputCustomFields, setInputCustomFields] = useState([])
    const [assetCustomFields, setAssetCustomFields] = useState(mappingCustomFieldData(inputCustomFields, []))


    const [permissions, setPermissions] = useState([])
    const [selectedPermissions, setSelectedPermissions] = useState([])

    const getCustomFieldsInputData = async () => {
        try {
            const { data } = await customFieldsApi.getCustomFields({isAll: 1, sort: 'createdAt,asc'})

            setInputCustomFields(data)

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

    const getPermissions = async () => {
        try {
            const { data } = await permissionApi.getPermissions()
            setPermissions(data)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getPermissions()
        getCustomFieldsInputData()
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
                placeholder={'Field name'}
                type={'text'}
                styleType={'regular-short'} />
          </div>
          <div className={'col-50'}>
            <Button
                styleTypes={['exclude-min-height']}
                type={'button'}
                text='Save'
                styleType='primary'
            />
          </div>
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
                  onClick={onSave}
              />
          </div>




      </div>
  )
}

export default AddCustomRole
