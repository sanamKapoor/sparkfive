import styles from './index.module.css'

import dateUtils from '../../../../../utils/date'

// Components
import Button from '../../../../common/buttons/button'


const UserItem = ({ user, getUserToken }) => {
  return (
    <div className={styles.container}>
      <div className={`${styles['name-email']} ${styles['centered-cell']}`}>
        <div>
          {user.name}
        </div>
        <div className={styles.email}>
          {user.email} 
        </div>
      </div>
      <div className={`${styles['centered-cell']} ${styles.date}`}>
        {dateUtils.parseDateToString(user.lastLogin)}
      </div>
      <div className={`${styles['centered-cell']} ${styles.date}`}>
        {dateUtils.parseDateToString(user.createdAt)}
      </div>
      <div className={`${styles['centered-cell']} ${styles.role}`}>
        {user.roleId !== 'user' && user.roleId !== 'admin' && user.roleId !== 'super_admin' ? 'Custom Role' : user.roleId}
      </div>
      <div className={`${styles.company} ${styles['centered-cell']}`}>
        <div className={!user.team.company && styles['no-comp']}>
          {user.team.company || 'No company name'}
        </div>
        <div>
          {user.team.plan.name}
        </div>
      </div>
      <Button onClick={getUserToken} type={'button'} styleType={'secondary'} text={'User login'} />
    </div>
  )
}

export default UserItem
