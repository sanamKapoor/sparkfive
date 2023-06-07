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
    onSaveChanges(member.id, saveData)
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.headers}>
          {type === "member" && <h3>Name</h3>}
          <h3>Email Address</h3>
          <h3>Role</h3>
        </div>
        <div className={styles.fields}>
          {type === "member" && (
            <div className={styles.name}>{member.name}</div>
          )}
          <div className={styles.email}>{member.email}</div>
          <div>
            <Select
              options={mappedRoles}
              onChange={(selected) => onRoleChange(selected)}
              placeholder={"Select a role"}
              styleType="regular"
              value={memberRole}
            />
          </div>
        </div>

        {memberRole && memberRole.type === "preset" && (
          <MemberPermissions
            memberPermissions={memberPermissions}
            permissions={permissions}
            setMemberPermissions={setMemberPermissions}
            listOnly={true}
          />
        )}
        <div className={styles["button-wrapper"]}>
          <Button
            text='Save Changes'
            type='button'
            className={styles['saveBtn']}
            text="Save Changes"
            type="button"
            onClick={onSaveMemberChanges}
            styleType={"primary"}
          />

          <Button className={'m-l-15'}
            text='Cancel'
            type='button'
            className={styles['saveBtn']}
            styleType='secondary'
            onClick={onCancel} />
        </div>
      </div>
    </div>
  );
}

export default MemberDetail
