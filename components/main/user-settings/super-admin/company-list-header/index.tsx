import React from 'react' 
import styles from './index.module.css'
import { Assets } from '../../../../../assets'
import { CompanyListHeaderProps, defaultSortData } from './types'

const CompanyListHeader: React.FC<CompanyListHeaderProps> = ({ setSortData, sortData, sortId, title, big }) => {
  const isActive = sortData.sortBy === sortId

  const toggleSortHandler = () => {

    if (sortData.sortBy !== sortId) return setSortData({
      sortBy: sortId,
      sortDirection: 'ASC',
      activeList: 'allAccounts'
    })

    if (sortData.sortDirection === 'ASC') return setSortData({
      sortBy: sortId,
      sortDirection: 'DESC',
      activeList: 'allAccounts'
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
          ${big ? styles.big : ''}
          ${styles.icon} 
          ${isActive ? styles['icon_active'] : ''}
          ${sortData.sortDirection === 'ASC' ? '' : styles.desc}
          `
        } 
      />
    </span> 
  )
}

export default CompanyListHeader