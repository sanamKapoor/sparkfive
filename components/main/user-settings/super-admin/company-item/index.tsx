import styles from './index.module.css'

import dateUtils from '../../../../../utils/date'

// Components
import Button from '../../../../common/buttons/button'
import { textSpanIsEmpty } from 'typescript'
import fileSize from 'filesize'

const CompanyItem = ({ team, onViewCompanySettings }) => {
  return (
    <div className={styles.container}>
      <div className={styles['name-email']}>
          <div>
              {team.company ?? 'No name'}
          </div>
      </div>

      <div className={styles.company}>
          <div>
              {team.users[0]?.name}
          </div>
          <div>
              {team.users[0]?.email}
          </div>
      </div>

      <div className={styles.date}>
        { dateUtils.parseDateToString(team.users[0].lastLogin) }
      </div>

      <div className={styles.date}>
        { dateUtils.parseDateToString(team.users[0].createdAt) }
      </div>

      <div className={styles.date}>
        { dateUtils.parseDateToString(team.users[0].lastUpload) }
      </div>

      <div className={styles.storage}>
        { fileSize(team.users[0]?.storageUsed).replace(' ', '') }
      </div>
 
      <div className={styles.files}>
        { team.users[0]?.filesCount }
      </div>

      <div className={styles.role}>
        {team.plan?.name}
      </div>
      <Button className={styles.btn} onClick={onViewCompanySettings} type={'button'} styleType={'secondary'} text={'Settings'} />
    </div>
  )
}

export default CompanyItem
