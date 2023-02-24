import styles from './dropdown.module.css'
import { UserContext } from '../../../context'
import { useContext } from 'react'

import UserPhoto from '../user/user-photo'

const Dropdown = ({ admOptions, settingsOptions = [], additionalClass = '', user, logout }) => {
  const { hasPermission } = useContext(UserContext)

  return (
    <ul className={`${styles.menu} ${additionalClass}`} >
      <div className={styles.user}>
        <UserPhoto photoUrl={user.profilePhoto} extraClass={styles.profile} sizePx={28} />
        <span className={styles.name}>{user?.name}</span>
      </div>
      <div className={styles.title}>Administration</div>
      {admOptions.map((option, index) => (
        <div key={option.id || index}>
          {(!option.permissions || hasPermission(option.permissions)) &&
            <div>
              {option.OverrideComp ?
                <option.OverrideComp />
                :
                <li onClick={() => {
                  option.onClick()
                }}>
                  <span>
                    {option.icon &&
                      <img src={option.icon} />
                    }
                  </span>
                  <span>
                    {option.label}
                  </span>
                </li>
              }
            </div>
          }
        </div>
      ))}
      <div className={styles["list-divider"]}></div>
      <div className={styles.title}>Settings</div>
      {settingsOptions.map((option, index) => (
        <div key={option.id || index}>
          {(!option.permissions || hasPermission(option.permissions)) &&
            <div>
              {option.OverrideComp ?
                <option.OverrideComp />
                :
                <li onClick={() => {
                  option.onClick()
                }}>
                  <span>
                    {option.icon &&
                      <img src={option.icon} />
                    }
                  </span>
                  <span>
                    {option.label}
                  </span>
                </li>
              }
            </div>
          }
        </div>
      ))}
      <div className={styles["list-divider"]}></div>
      <li onClick={logout.onClick}>
        <span>
          {logout.label}
        </span>
      </li>
    </ul>
  )
}

export default Dropdown
