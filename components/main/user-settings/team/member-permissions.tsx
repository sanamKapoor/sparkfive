import styles from './member-permissions.module.css'
import update from 'immutability-helper'
import { Utilities } from '../../../../assets'
import { useEffect, useState, useContext } from 'react'
import { TeamContext } from '../../../../context'

const MemberPermissions = ({ memberPermissions, permissions, setMemberPermissions, listOnly = false }) => {

  const [mappedPermissions, setMappedPermissions] = useState([])
  const { plan } = useContext(TeamContext)

  useEffect(() => {
    if (listOnly || (memberPermissions.length > 0 && permissions.length > 0)) {
      const groups = {}
      permissions.forEach(permission => {
        const { category, id } = permission
        const permissionObj = {
          ...permission,
          enabled: memberPermissions.findIndex(memberPer => memberPer.id === id) !== -1
        }
        if (groups[category]) {
          groups[category].features.push(permissionObj)
        } else {
          groups[category] = {
            category,
            features: [permissionObj]
          }
        }
      })
      setMappedPermissions(Object.values(groups))
    }
  }, [memberPermissions, permissions])

  const togglePermission = (permission) => {
    const permissionIndex = memberPermissions.findIndex(memberPer => memberPer.id === permission.id)
    if (permissionIndex !== -1) {
      setMemberPermissions(update(memberPermissions, {
        $splice: [[permissionIndex, 1]]
      }))
    } else {
      setMemberPermissions(update(memberPermissions, {
        $push: [permission]
      }))
    }
  }

  let permissionsList = mappedPermissions
  if (plan?.type === 'dam') {
    permissionsList = mappedPermissions.filter(damPermission => damPermission.category === 'Asset Library')
  }

  return (
    <div className={`${styles.container} ${listOnly ? styles['flex-row'] : ''}`}>
      {!listOnly && <h3>Permissions</h3>}
      {permissionsList.map(({ category, features }) => (
        <div key={category} className={styles.group}>
          <h4>{category}</h4>
          <ul>
            {features.map((permission) => (
              <li key={permission.id} className={styles.feature}>
                <div>
                  {permission.name}
                </div>
                <img src={permission.enabled ? Utilities.radioButtonEnabled : Utilities.radioButtonNormal} onClick={() => togglePermission(permission)} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export default MemberPermissions
