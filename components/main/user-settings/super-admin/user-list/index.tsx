import styles from './index.module.css'
import { useState, useEffect } from 'react'
import Router from 'next/router'
import cookiesUtils from '../../../../../utils/cookies'
import superAdminApi from '../../../../../server-api/super-admin'
import { defaultSortData } from './types'
import { useQueryStrings } from '../../../../../hooks/use-query-strings'

// Components
import UserListHeader from '../user-list-header'
import UserItem from '../user-item'
import Search from '../../../../common/inputs/search'
import Button from '../../../../common/buttons/button'
import SpinnerOverlay from "../../../../common/spinners/spinner-overlay";
import { Assets } from '../../../../../assets'



const UserList = () => {

  const [term, setTerm] = useState('')
  const [loading, setLoading] = useState(true)

  const [userData, setUserData] = useState({
    users: [],
    currentPage: 1,
    total: 0,
  })
  const [sortData, setSortData] = useQueryStrings(defaultSortData)

  useEffect(() => {
    if (Object.keys(sortData).length) {
      getUsers({
        sortBy: sortData.sortBy,
        sortDirection: sortData.sortDirection,
        reset: true
      })
    }
  }, [sortData])

  const getUsers = async ({ page = 1, searchTerm = term, reset = false, sortBy = 'users.lastLogin', sortDirection = 'ASC' } = {}) => {
    try {
      setLoading(true)
      let newUsers = userData.users
      if (reset) newUsers = []

      const { data } = await superAdminApi.getUsers({ term: searchTerm, page, sortBy, sortOrder: sortDirection })
      const users = [...newUsers, ...data.users]

      setUserData({
        users,
        currentPage: page,
        total: data.total,
      })
      console.groupEnd()
      setLoading(false)
    } catch (err) {
      setLoading(false)
      console.log(err)
    }
  }

  const searchAndGetUsers = (searchTerm) => {
    getUsers({
      searchTerm,
      page: 1,
      reset: true,
      sortBy: sortData.sortBy,
      sortDirection: sortData.sortDirection
    })
    setTerm(searchTerm)
  }

  const getUserJWT = async (user) => {
    try {
      const { data } = await superAdminApi.getUserJWT(user.id)
      // Place tokens in cookies to be able to return
      const adminJwt = cookiesUtils.get('jwt')
      cookiesUtils.set('adminToken', adminJwt)
      cookiesUtils.setUserJWT(data.token)
      await Router.replace('/main/overview')
      Router.reload()
    } catch (err) {
      console.log(err)
    }
  }

  const getMore = () => {
    getUsers({ page: userData.currentPage + 1, sortBy: sortData.sortBy, sortDirection: sortData.sortDirection })
  }

  return (
    <div className={styles.container}>
      <Search onSubmit={searchAndGetUsers} placeholder={'Search users by name or email'} />
      <ul className={styles.list}>
        <li>
          <div className={styles['header-container']}>
            <div className={`${styles['centered-cell']} ${styles['name-email']}`}>
              <UserListHeader setSortData={setSortData} sortData={sortData} sortId='users.name' title='User' />
            </div>
            <div className={`${styles['centered-cell']} ${styles.date}`}>
              <UserListHeader setSortData={setSortData} sortData={sortData} sortId='users.lastLogin' title='Last Login' />
            </div>
            <div className={`${styles['centered-cell']} ${styles.date}`}>
              <UserListHeader setSortData={setSortData} sortData={sortData} sortId='users.createdAt' title='Created At' />
            </div>
            <div className={`${styles['centered-cell']} ${styles.role}`}>
              <UserListHeader setSortData={setSortData} sortData={sortData} sortId='users.roleId' title='Role' />
            </div>
            <div className={`${styles['centered-cell']} ${styles.company}`}>
              <UserListHeader setSortData={setSortData} sortData={sortData} sortId='team.company' title='Company' />
            </div>
            <div className={styles.button}/> {/*it needs to implement button column width*/}
          </div>
        </li>
        {userData.users.map(user => (
          <li key={user.id}>
            <UserItem getUserToken={() => getUserJWT(user)} user={user} />
          </li>
        ))}
      </ul>
      {userData.total > userData.users.length &&
        <div className={styles.action}>
          <Button text={'Load more'} onClick={getMore} type={'button'} styleType={'primary'} />
        </div>
      }

      {loading && <SpinnerOverlay />}
    </div>
  )
}

export default UserList
