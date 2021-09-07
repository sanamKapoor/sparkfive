import styles from './index.module.css'

// Components
import Button from '../../../../common/buttons/button'

const CompanyItem = ({ team, onViewCompanySettings }) => {
  return (
    <div className={styles.container}>
      <div className={styles['name-email']}>
          <div>
              {team.company}
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
      <div className={styles.role}>
        {team.plan?.name}
      </div>
      <Button onClick={onViewCompanySettings} type={'button'} styleType={'secondary'} text={'Settings'} />
    </div>
  )
}

export default CompanyItem
