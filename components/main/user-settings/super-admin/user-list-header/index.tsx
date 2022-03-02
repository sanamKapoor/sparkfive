import React from 'react' 
import { UserListHeaderProps } from './types'
import { Assets } from '../../../../../assets'
import { useQueryStrings } from '../../../../../hooks/use-query-strings'

import styles from './index.module.css'
import { defaultSortData } from '../user-list/types'

const UserListHeader: React.FC<UserListHeaderProps> = ({ title, setSortData, sortData, sortId }) => {

  const isActive = sortData.sortBy === sortId

  const toggleSortHandler = () => {

    if (sortData.sortBy !== sortId) return setSortData({
      sortBy: sortId,
      sortDirection: 'ASC',
      activeList: 'allUsers'
    })

    if (sortData.sortDirection === 'ASC') return setSortData({
      sortBy: sortId,
      sortDirection: 'DESC',
      activeList: 'allUsers'
    })

    setSortData(defaultSortData)
  }

  return (
    <span onClick={toggleSortHandler} className={styles.container}>
      <div className={styles.title}>{title}</div>

      <img 
        src={Assets.arrowDown} 
        className={
          `
          ${styles.big}
          ${styles.icon} 
          ${isActive ? styles['icon_active'] : ''}
          ${sortData.sortDirection === 'ASC' ? '' : styles.desc}
          `
        } 
      />
    </span>
  )
}

export default UserListHeader