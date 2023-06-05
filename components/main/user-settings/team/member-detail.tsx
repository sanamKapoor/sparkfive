import styles from './member-detail.module.css'
import { useState, useEffect } from 'react'

import permissionApi from '../../../../server-api/permission'
import teamApi from '../../../../server-api/team'

import customFieldsApi from '../../../../server-api/attribute'
import folderApi from '../../../../server-api/folder'
import campaignApi from '../../../../server-api/campaign'

import update from 'immutability-helper';

// Components
import Button from '../../../common/buttons/button'
import Select from '../../../common/inputs/select'
import MemberPermissions from './member-permissions'
import CreatableSelect from '../../../common/inputs/creatable-select'

import CustomFieldSelector from "../../../common/items/custom-field-selector";

import { default as permissionList } from "../../../../constants/permissions"

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

const MemberDetail = ({ member, type = 'member', mappedRoles, onSaveChanges, onCancel }) => {
  const [memberRole, setMemberRole] = useState(undefined)
  const [memberPermissions, setMemberPermissions] = useState([])
  const [permissions, setPermissions] = useState([])
  const [activeDropdown, setActiveDropdown] = useState('')
  const [activeSection, setActiveSection] = useState('restrictions')

    const [name, setName] = useState('')

    const [collections, setCollections] = useState([])
    const [selectedCollections, setSelectedCollection] = useState([])

    const [campaigns, setCampaigns] = useState([])
    const [selectedCampaigns, setSelectedCampaigns] = useState([])

    const [activeCustomField, setActiveCustomField] = useState<number>()
    const [inputCustomFields, setInputCustomFields] = useState([])
    const [assetCustomFields, setAssetCustomFields] = useState(mappingCustomFieldData(inputCustomFields, []))


    const [selectedPermissions, setSelectedPermissions] = useState([])

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

    // const getPermissions = async () => {
    //     try {
    //         const { data } = await permissionApi.getPermissions()
    //         setPermissions(data)

    //         // In default, all permission will be selected
    //         setSelectedPermissions(data)
    //         return data
    //     } catch (err) {
    //         console.log(err)
    //     }
    // }

    const getDefaultValue = async (inputCustomFields) => {
        if(memberRole){
            const { data } = await teamApi.getRoleDetail(memberRole?.id)
            setSelectedCollection(data.folders)
            setSelectedCampaigns(data.campaigns)
            setSelectedPermissions(data.permissions)
            setName(data.name)

            const updatedMappingCustomFieldData =  mappingCustomFieldData(inputCustomFields, data.customs)

            setAssetCustomFields(update(assetCustomFields, {
                $set: updatedMappingCustomFieldData
            }))

        }else{

        }
    }

    const getAll = async() => {
        const [folderData, permissionData, inputCustomFieldsData] = await Promise.all([getFolders(),  getPermissions(),  getCustomFieldsInputData()])
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
        if(memberRole){
            await teamApi.editRole(memberRole?.id, {
              name,
              collections: selectedCollections.map(
                (collection) => collection.id
              ),
              campaigns: selectedCampaigns.map((campaign) => campaign.id),
              customFieldValues: customFieldValueIds,
              permissions: selectedPermissions.map(
                (permission) => permission.id
              ),
              configs: { andMainField: false, andCustomAttribute: false },
            });
        }else{ // Create new one
            await teamApi.createCustomRole({
              name,
              collections: selectedCollections.map(
                (collection) => collection.id
              ),
              campaigns: selectedCampaigns.map((campaign) => campaign.id),
              customFieldValues: customFieldValueIds,
              permissions: selectedPermissions.map(
                (permission) => permission.id
              ),
              configs: { andMainField: false, andCustomAttribute: false },
            });
        }


        setLoading(false)

        onSaveChanges()
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



  const onRoleChange = (role) => {
    if (role.id === 'user') {
      let permission = permissions.filter((item, index) => {
        return [permissionList.ASSET_ACCESS, permissionList.ASSET_DOWNLOAD, permissionList.ASSET_SHARE].includes(item.id)
      })
      setMemberPermissions(permission)
    }

    setMemberRole(role)
  }

  useEffect(() => {
    getPermissions()
  }, [])

  useEffect(() => {
    if (member) {
      setMemberRole(getMemberRole(member.role))
      setMemberPermissions(member.permissions)
    }
  }, [member])

  const getMemberRole = (role) => {
    return mappedRoles.find(mappedRole => mappedRole.id === role.id)
  }

  const getPermissions = async () => {
    try {
      const { data } = await permissionApi.getPermissions()
      setPermissions(data)
    } catch (err) {
      console.log(err)
    }
  }

  const onSaveMemberChanges = () => {
    const saveData = {
      permissions: memberPermissions,
      updatePermissions: true,
      roleId: memberRole.id
    }
    // if (member.role.id !== memberRole.id) {
    //   saveData.roleId = memberRole.id
    // }
    onSaveChanges(member.id, saveData)
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.headers}>
          {type === 'member' && <h3>Name</h3>}
          <h3>Email Address</h3>
          <h3>Role</h3>
        </div>
        <div className={styles.fields}>
          {type === 'member' && <div className={styles.name}>{member.name}</div>}
          <div className={styles.email}>{member.email}</div>
          <div>
            <Select
              options={mappedRoles}
              onChange={(selected) => onRoleChange(selected)}
              placeholder={'Select a role'}
              styleType='regular'
              value={memberRole}
            />
          </div>
        </div>
        <div className={styles['button-wrapper']}>
          <Button
            text='Save Changes'
            type='button'
            onClick={onSaveMemberChanges}
            styleType={'primary'}
          />

          <Button className={'m-l-15'}
            text='Cancel'
            type='button'
            styleType='secondary'
            onClick={onCancel} />

        </div>

        {memberRole && memberRole.type === 'preset' &&
          <>
            <div className={styles['nav-buttons']}>
              <div
                className={`${styles['nav-button']} ${activeSection === 'restrictions' ? styles.active : ''}`}
                onClick={() => setActiveSection('restrictions')}
              >
                Content Restrictions
              </div>
              <div
                className={`${styles['nav-button']} ${activeSection === 'permissions' ? styles.active : ''}`}
                onClick={() => setActiveSection('permissions')}
              >
                Action Permissions
              </div>
            </div>

            {activeSection === 'restrictions' && <div className={'m-l-30 m-t-50'}>
              <div className={styles.field} >
              <h4>Collections</h4>
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
                          setActiveDropdown('')
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

              <div className={styles.field}>
              <h4>Custom Fields</h4>
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
                                  }}
                                  onRemoveOperationFinished={async (index, stateUpdate, removeId) => {
                                  }}
                                  onOperationFailedSkipped={() => setActiveCustomField(undefined)}
                                  isShare={false}
                                  asyncCreateFn={(newItem) => { 
                                      return true;
                                  }
                                  }
                                  dropdownIsActive={activeCustomField === index}
                              />
                          </div>
                      }
                  })}
              </div>
          </div>}

            {activeSection === 'permissions' &&
              <>
                <MemberPermissions memberPermissions={memberPermissions}
                  permissions={permissions} setMemberPermissions={setMemberPermissions} listOnly={true} />
                  <div className={styles["button-wrapper"]}>
                  <Button
                    text="Save Changes"
                    type="button"
                    onClick={onSaveMemberChanges}
                    styleType={"primary"}
                  />

                  <Button
                    className={"m-l-15"}
                    text="Cancel"
                    type="button"
                    styleType="secondary"
                    onClick={onCancel}
                  />
                </div>
              </>
            }
          </>
        }

      </div>
    </div>
  )
}

export default MemberDetail
