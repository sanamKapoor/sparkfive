import styles from './member-detail.module.css'
import { useState, useEffect } from 'react'

import permissionApi from '../../../../server-api/permission'
import teamApi from '../../../../server-api/team'

// Components
import Button from '../../../common/buttons/button'
import Select from '../../../common/inputs/select'
import MemberPermissions from './member-permissions'
import CreatableSelect from '../../../common/inputs/creatable-select'

import { default as permissionList } from "../../../../constants/permissions"

const MemberDetail = ({ member, type = 'member', mappedRoles, onSaveChanges, onCancel }) => {

  const [memberRole, setMemberRole] = useState(undefined)
  const [memberPermissions, setMemberPermissions] = useState([])
  const [permissions, setPermissions] = useState([])
  const [activeDropdown, setActiveDropdown] = useState('')
  const [activeSection, setActiveSection] = useState('restrictions')


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

            {activeSection === 'restrictions' &&
              <>
                <div className={styles.field}>
                  <h4>Collections</h4>
                  <CreatableSelect
                    altColor='blue'
                    title=''
                    addText='Add Collections'
                    onAddClick={() => setActiveDropdown('collections')}
                    selectPlaceholder={'Enter a new collections or select an existing one'}
                    setSelectedItems={() => console.log('set collections')}
                    onAddOperationFinished={() => setActiveDropdown('')}
                    onRemoveOperationFinished={() => null}
                    onOperationFailedSkipped={() => setActiveDropdown('')}
                    asyncCreateFn={() => null}
                    dropdownIsActive={activeDropdown === 'collections'}
                    isShare={false}
                    isBulkEdit={true}
                    canAdd={true}
                  />
                </div>

                <div className={styles.field}>
                  <h4>Custom Fields</h4>
                  <CreatableSelect
                    altColor='blue'
                    title='Divisions'
                    addText='Add Custom Field'
                    onAddClick={() => setActiveDropdown('customFields ')}
                    selectPlaceholder={'Enter a new Custom Field or select an existing one'}
                    setSelectedItems={() => console.log('set custom Fiel')}
                    onAddOperationFinished={() => setActiveDropdown('')}
                    onRemoveOperationFinished={() => null}
                    onOperationFailedSkipped={() => setActiveDropdown('')}
                    asyncCreateFn={() => null}
                    dropdownIsActive={activeDropdown === 'customFields'}
                    isShare={false}
                    isBulkEdit={true}
                    canAdd={true}
                  />
                </div>

                <div className={styles.field}>
                  <h4>Regions</h4>
                  <div className={styles.select}>
                    <Select
                      options={['North', 'West']}
                      onChange={() => console.log('on change')}
                      placeholder={'Select Field'}
                      styleType='regular'
                      value={''}
                    />
                  </div>
                </div>
              </>
            }
            {activeSection === 'permissions' &&
              <>
                <MemberPermissions memberPermissions={memberPermissions}
                  permissions={permissions} setMemberPermissions={setMemberPermissions} listOnly={true} />
              </>
            }
          </>
        }

      </div>
    </div>
  )
}

export default MemberDetail
