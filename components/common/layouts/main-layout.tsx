import { useContext, useRef } from 'react'
import styles from './main-layout.module.css'
import Link from 'next/link'
import { GeneralImg, Navigation } from '../../../assets'
import { UserContext, LoadingContext } from '../../../context'
import cookiesUtils from '../../../utils/cookies'
import Router from 'next/router'
import {
  SETTINGS_BILLING,
  SETTINGS_SECURITY,
  SETTINGS_TEAM,
  SETTINGS_COMPANY,
  SETTINGS_PLAN,
  SUPERADMIN_ACCESS,
  ASSET_UPLOAD_APPROVAL
} from '../../../constants/permissions'
import { TeamContext } from '../../../context'

// Components
import HeaderLink from '../layouts/header-link'
import ToggleableAbsoluteWrapper from '../misc/toggleable-absolute-wrapper'
import Dropdown from '../inputs/dropdown'
import TrialReminderModal from '../modals/trial-reminder-modal'
import UserPhoto from '../user/user-photo'
import NoPermissionNotice from '../misc/no-permission-notice'
import Notification from '../notifications/notification'
import SpinnerOverlay from '../spinners/spinner-overlay'
import Button from '../buttons/button'

const MainLayout = ({ children, requiredPermissions = [] }) => {
  const { user, logOut, hasPermission } = useContext(UserContext)
  const { isLoading } = useContext(LoadingContext)
  const pageListRef = useRef(null)

  const { plan } = useContext(TeamContext)

  const SettingsLink = ({ settingRef, name }) => (
    <Link href={`/main/user-settings/${settingRef}`}>
      <a>
        <li>
          <span></span>
          <span>{name}</span>
        </li>
      </a>
    </Link>
  )

  const MainLink = ({ settingRef, name }) => (
      <Link href={`/main/${settingRef}`}>
        <a>
          <li>
            <span></span>
            <span>{name}</span>
          </li>
        </a>
      </Link>
  )

  const adminJWT = cookiesUtils.get('adminToken')

  const getBackToAdmin = async () => {
    cookiesUtils.setUserJWT(adminJWT)
    cookiesUtils.remove('adminToken')
    Router.reload()
  }

  const admDropdownOptions = [
    { OverrideComp: () => <SettingsLink name='Profile' settingRef='profile' /> },
  ]

  const settingsDropdownOptions = []

  if (hasPermission([SETTINGS_COMPANY])) admDropdownOptions.push({ OverrideComp: () => <SettingsLink name='Company' settingRef='company' /> })
  if (hasPermission([SETTINGS_BILLING])) admDropdownOptions.push({ OverrideComp: () => <SettingsLink name='Billing' settingRef='billing' /> })
  // if (hasPermission([SETTINGS_PLAN])) admDropdownOptions.push({ OverrideComp: () => <SettingsLink name='Plan' settingRef='plan' /> })
  if (hasPermission([SETTINGS_SECURITY])) admDropdownOptions.push({ OverrideComp: () => <SettingsLink name='Security' settingRef='security' /> })
  if (hasPermission([SETTINGS_TEAM])) admDropdownOptions.push({ OverrideComp: () => <SettingsLink name='Team' settingRef='team' /> })
  if (hasPermission([SETTINGS_TEAM])) settingsDropdownOptions.push({ OverrideComp: () => <SettingsLink name='Attributes' settingRef='attributes' /> })
  settingsDropdownOptions.push({ OverrideComp: () => <SettingsLink name='Notifications' settingRef='notifications' /> })
  if (hasPermission([SETTINGS_TEAM])) settingsDropdownOptions.push({ OverrideComp: () => <SettingsLink name='Guest Upload' settingRef='guest-upload' /> })
  settingsDropdownOptions.push({ OverrideComp: () => <MainLink name='Upload Approvals' settingRef='upload-approvals' /> })
  if (hasPermission([SETTINGS_TEAM])) settingsDropdownOptions.push({ OverrideComp: () => <SettingsLink name='Custom Settings' settingRef='custom-settings' /> })
  settingsDropdownOptions.push({ OverrideComp: () => <SettingsLink name='Integrations' settingRef='integrations' /> })
  settingsDropdownOptions.push({ OverrideComp: () => <SettingsLink name='Shared Links' settingRef='shared-links' /> })
  if (hasPermission([SUPERADMIN_ACCESS])) settingsDropdownOptions.push({ OverrideComp: () => <SettingsLink name='Super Admin' settingRef='super-admin' /> })

  const toggleHamurgerList = () => {
    const classType = `visible-block`
    const { current } = pageListRef
    if (current?.classList.contains(classType)) current.classList.remove(classType)
    else current.classList.add(classType)
  }

  return (
    <>
      {user &&
        <>
          <header id={'main-header'} className={styles.header}>
            <Link href={plan?.type === 'marketing_hub' ? '/main/overview' : '/main/assets'}>
              <a>
                <img
                  className={styles['logo-img']}
                  src={GeneralImg.logo} />
              </a>
            </Link>
            <div className={styles.hamburger} onClick={toggleHamurgerList}>&#9776;</div>
            <ul className={styles['navigation-links']} ref={pageListRef}>
              {plan?.type === 'marketing_hub' &&
              <HeaderLink
                active={Router.pathname.indexOf('overview') !== -1}
                href='/main/overview'
                img={Router.pathname.indexOf('overview') !== -1 ? Navigation.overviewSelected : Navigation.overview}
                imgHover={Navigation.overviewSelected}
                text='Overview'
              />}
              <HeaderLink
                active={Router.pathname.indexOf('assets') !== -1}
                href='/main/assets'
                img={Router.pathname.indexOf('assets') !== -1 ? Navigation.assetsSelected : Navigation.assets}
                imgHover={Navigation.assetsSelected}
                text='Assets'
              />
              {plan?.type === 'marketing_hub' &&
              <HeaderLink
                active={Router.pathname.indexOf('schedule') !== -1}
                href='/main/schedule'
                img={Router.pathname.indexOf('schedule') !== -1 ? Navigation.scheduleSelected : Navigation.schedule}
                imgHover={Navigation.scheduleSelected}
                text='Schedule'
              />}
            </ul>
            <div className={styles['notifications-wrapper']}>
              <Notification />
            </div>

            <ToggleableAbsoluteWrapper
              wrapperClass={styles.user}
              Wrapper={({ children }) => (
                <>
                  <UserPhoto photoUrl={user.profilePhoto} extraClass={styles.profile} sizePx={35} />
                  {children}
                </>
              )}
              contentClass={styles['user-dropdown']}
              Content={() => (
                <Dropdown
                  admOptions={admDropdownOptions}
                  settingsOptions={settingsDropdownOptions}
                  user={user}
                  logout={{ label: 'Log Out', onClick: logOut }}
                />
              )}
            />
          </header>
          {isLoading && <SpinnerOverlay />}
          {hasPermission(requiredPermissions) || hasPermission([ASSET_UPLOAD_APPROVAL]) ?
            children
            :
            <NoPermissionNotice />
          }
          {adminJWT &&
            <div className={styles['superadmin-back']} >
              <Button
                text='Go back to Superadmin'
                type='button'
                styleType='secondary'
                onClick={getBackToAdmin}
              />
            </div>}
          <footer className={styles.footer}>
            <TrialReminderModal />
          </footer>
        </>
      }
    </>
  )
}

export default MainLayout
