import styles from './member-permissions.module.css'
import update from 'immutability-helper'
import { Utilities } from '../../../../assets'
import { useEffect, useState, useContext } from 'react'
import { TeamContext } from '../../../../context'

const MemberPermissions = ({ memberPermissions, permissions, setMemberPermissions, listOnly = false }) => {


  const [mappedPermissions, setMappedPermissions] = useState([])
  const { plan } = useContext(TeamContext)

  // Filter apply to only show asset library for dam plan
  const filter = (data) => {
    let permissionsList = data
    if (plan?.type === 'dam') {
      permissionsList = data.filter(damPermission => damPermission.category === 'Asset Library')
    }

    return permissionsList
  }

  useEffect(() => {
    if (listOnly || (memberPermissions.length > 0 && permissions.length > 0)) {
      const groups = {}
      permissions.forEach(permission => {
        const { category, id } = permission
        const permissionObj = {
          ...permission,
          enabled: memberPermissions?.findIndex(memberPer => memberPer.id === id) !== -1
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
      setMappedPermissions(filter(Object.values(groups)))
    }
  }, [memberPermissions, permissions])

  const togglePermission = (permission) => {
    const permissionIndex = memberPermissions.findIndex(memberPer => memberPer.id === permission.id)

    // Check if any fields need to be switched to off due to this toggle
    const toggleOffPermissionIndex = permission.toggleOffFields ? memberPermissions.findIndex(memberPer => permission.toggleOffFields.split(",").includes(memberPer.id)) : -1

    // Already added, toggle off
    if (permissionIndex !== -1) {
      setMemberPermissions(update(memberPermissions, {
        $splice: [[permissionIndex, 1]]
      }))
    } else { // Not added yet

      const arr = [...memberPermissions];

      // If there is field need to be switched off
      if (toggleOffPermissionIndex !== -1) {
        // Remove it
        arr.splice(toggleOffPermissionIndex, 1)
      }

      // Add the new one
      arr.push(permission)

      setMemberPermissions(arr)

    }
  }

  return (
    <div className={`${styles.container}`}>
          {mappedPermissions.map(({ category, features }) => (
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
