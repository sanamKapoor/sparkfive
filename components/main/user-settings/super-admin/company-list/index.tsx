import styles from './index.module.css'
import { useState, useEffect } from 'react'
import Router from 'next/router'
import cookiesUtils from '../../../../../utils/cookies'
import superAdminApi from '../../../../../server-api/super-admin'

// Components
import CompanyItem from '../company-item'
import Search from '../../../../common/inputs/search'
import Button from '../../../../common/buttons/button'
import SpinnerOverlay from "../../../../common/spinners/spinner-overlay";
import CompanyListHeader from '../company-list-header'
import { defaultSortData } from '../company-list-header/types'
import { useQueryStrings } from '../../../../../hooks/use-query-strings'


const CompanyList = ({onViewCompanySettings}) => {

  const [term, setTerm] = useState('')
  const [loading, setLoading] = useState(true)

  const [companyData, setCompanyData] = useState({
    teams: [],
    currentPage: 1,
    total: 0
  })
  const [sortData, setSortData] = useQueryStrings(defaultSortData)

  useEffect(() => {
    if (Object.keys(sortData).length > 0) {
      getCompany({
        sortBy: sortData.sortBy,
        sortDirection: sortData.sortDirection,
        reset: true
      })
    } 
  }, [sortData])

  const getCompany = async ({ page = 1, searchTerm = term, reset = false, sortBy = 'teams.company', sortDirection = 'ASC' } = {}) => {
    try {
      setLoading(true)
      let newTeams = companyData.teams
      if (reset) newTeams = []

      const { data } = await superAdminApi.getCompanies({ term: searchTerm, page, sortBy, sortOrder: sortDirection })
      const teams = [...newTeams, ...data.teams]

      setCompanyData({
        teams,
        currentPage: page,
        total: data.total
      })

      setLoading(false)
    } catch (err) {
      setLoading(false)
      console.log(err)
    }
  }

  const searchAndGetUsers = (searchTerm) => {
    getCompany({
      searchTerm,
      page: 1,
      reset: true,
      sortBy: sortData.sortBy,
      sortDirection: sortData.sortDirection
    })
    setTerm(searchTerm)
  }

  const getMore = () => {
    getCompany({ page: companyData.currentPage + 1, sortBy: sortData.sortBy, sortDirection: sortData.sortDirection })
  }

  return (
    <div className={styles.container}>
      <Search onSubmit={searchAndGetUsers} placeholder={'Search accounts by company name, admin name or email'} />
      <ul className={styles.list}>
        <li>
          <div className={styles.row}>
            <div className={`${styles['name-email']} ${styles['header-title']}`}>
              <CompanyListHeader setSortData={setSortData} sortData={sortData} sortId='teams.company' title='Company' />
            </div>
            <div className={`${styles.company} ${styles['header-title']}`}>
              <CompanyListHeader setSortData={setSortData} sortData={sortData} sortId='users.name' title='Senior Admin' />
            </div>
            <div className={`${styles.date} ${styles['header-title']}`}>
              <CompanyListHeader setSortData={setSortData} sortData={sortData} sortId='users.lastLogin' title='Last Login' />
            </div>
            <div className={`${styles.date} ${styles['header-title']}`}>
              <CompanyListHeader setSortData={setSortData} sortData={sortData} sortId='users.createdAt' title='Created Date' />
            </div>
            <div className={`${styles.date} ${styles['header-title']}`}>
              <CompanyListHeader setSortData={setSortData} sortData={sortData} sortId='users.lastUpload' title='Last Upload' />
            </div>
            <div className={`${styles.storage} ${styles['header-title']}`}>
              <CompanyListHeader setSortData={setSortData} sortData={sortData} sortId='users.storageUsed' title='Storage Used' />
            </div>
            <div className={`${styles.files} ${styles['header-title']}`}>
              <CompanyListHeader setSortData={setSortData} sortData={sortData} big sortId='users.filesCount' title='Files Upload' />
            </div>
            <div className={`${styles.plan} ${styles['header-title']}`}>
              <CompanyListHeader setSortData={setSortData} sortData={sortData} sortId='plan.name' title='Plan' />
            </div>
            <div className={styles.btn} />
          </div>
        </li>
        {companyData.teams.map(user => (
            <li key={user.id}>
              <CompanyItem team={user} onViewCompanySettings={()=>{onViewCompanySettings(user)}}/>
            </li>
        ))}
      </ul>
      {companyData.total > companyData.teams.length &&
      <div className={styles.action}>
        <Button text={'Load more'} onClick={getMore} type={'button'} styleType={'primary'} />
      </div>
      }

      {loading && <SpinnerOverlay />}
    </div>
  )
}

export default CompanyList
