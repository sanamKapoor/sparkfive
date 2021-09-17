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


const CompanyList = ({onViewCompanySettings}) => {

  const [term, setTerm] = useState('')
  const [loading, setLoading] = useState(true)

  const [companyData, setCompanyData] = useState({
    teams: [],
    currentPage: 1,
    total: 0
  })

  useEffect(() => {
    getCompany()
  }, [])

  const getCompany = async ({ page = 1, searchTerm = term, reset = false } = {}) => {
    try {
      setLoading(true)
      let newTeams = companyData.teams
      if (reset) newTeams = []
      const { data } = await superAdminApi.getCompanies({ term: searchTerm, page })
      setCompanyData({
        teams: [...newTeams, ...data.teams],
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
      reset: true
    })
    setTerm(searchTerm)
  }

  const getMore = () => {
    getCompany({ page: companyData.currentPage + 1 })
  }

  return (
    <div className={styles.container}>
      <Search onSubmit={searchAndGetUsers} placeholder={'Search accounts by company name, admin name or email'} />
      <ul className={styles.list}>
        <li>
          <div className={styles.row}>
            <div className={`${styles['name-email']} ${styles['header-title']}`}>
              <div>
                Company Name
              </div>
            </div>
            <div className={`${styles.company} ${styles['header-title']}`}>
              Account Senior Admin
            </div>
            <div className={`${styles.role} ${styles['header-title']}`}>
              Plan
            </div>
            <Button className={styles.invisible} type={'button'} styleType={'secondary'} text={'Settings'} />
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
