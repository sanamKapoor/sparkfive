import styles from './index.module.css'
import { useRouter } from 'next/router'
import { useState, useEffect, useContext } from 'react'
import urlUtils from '../../../utils/url'
import { UserContext } from '../../../context'
import { capitalCase } from 'change-case'
import { isMobile } from 'react-device-detect'
import LocationContextProvider from '../../../context/location-provider'

import {
  SETTINGS_BILLING,
  SETTINGS_SECURITY,
  SETTINGS_TEAM,
  SETTINGS_COMPANY,
  SETTINGS_PLAN,
  SUPERADMIN_ACCESS
} from '../../../constants/permissions'

// Components
import SideNavigation from './side-navigation'
import Profile from './profile'
import Team from './team'
import Company from './company'
import Billing from './billing'
import Plan from './plan'
import Security from './security'
import Integrations from './integrations'
import Attributes from "./attributes"
import SuperAdmin from './super-admin'
import Notifications from './notifications'
import NoPermissionNotice from '../../common/misc/no-permission-notice'
import Button from '../../common/buttons/button'
import GuestUpload from "./guest-upload"
import CustomSettings from "./custom-settings"
import ShareLinks from "./share-links"
import UploadApprovals from "./upload-approvals"


const SETTING_OPTIONS = {
  profile: { label: 'Profile', permissions: [], content: Profile },
  billing: { label: 'Billing', permissions: [SETTINGS_BILLING], content: Billing },
  company: { label: 'Company', permissions: [SETTINGS_COMPANY], content: Company },
  // plan: { label: 'Plan', permissions: [SETTINGS_PLAN], content: Plan },
  security: { label: 'Security', permissions: [SETTINGS_SECURITY], content: Security },
  team: { label: 'Team', permissions: [SETTINGS_TEAM], content: Team },
  notifications: { label: 'Notifications', permissions: [], content: Notifications },
  ['guest-upload']: { label: 'Guest Upload', contentTitle: 'Guest Upload', permissions: [SETTINGS_TEAM, SETTINGS_COMPANY], content: GuestUpload },
  integrations: { label: 'Integrations', permissions: [], content: Integrations },
  attributes: { label: 'Attributes', contentTitle: 'Custom Attributes', permissions: [SETTINGS_TEAM, SETTINGS_COMPANY], content: Attributes },
  ['custom-settings']: { label: 'Custom Settings', contentTitle: 'Custom Settings', permissions: [SETTINGS_TEAM, SETTINGS_COMPANY], content: CustomSettings },
  ['shared-links']: { label: 'Shared Links', contentTitle: 'Shared Links', permissions: [], content: ShareLinks },
  ['super-admin']: { label: 'Super Admin', permissions: [SUPERADMIN_ACCESS], content: SuperAdmin },
}

const UserSettings = () => {

  const { hasPermission } = useContext(UserContext)

  const router = useRouter()

  useEffect(() => {
    const activeView = urlUtils.getPathId()
    setActiveView(activeView)
  }, [router.query.view])

  const [activeView, setActiveView] = useState('')
  const [menuActive, setMenuActive] = useState(true)

  let ActiveContent = () => <></>
  if (SETTING_OPTIONS[activeView]) ActiveContent = SETTING_OPTIONS[activeView].content

  const toggleSettings = () => {
    setMenuActive(!menuActive)
  }

  useEffect(() => {
    if (isMobile) {
      setMenuActive(false)
    }
  }, [])

  const getTitle = (activeView) => {
    if (SETTING_OPTIONS[activeView]) {
      return SETTING_OPTIONS[activeView].contentTitle ? SETTING_OPTIONS[activeView].contentTitle : activeView
    } else {
      return activeView
    }
  }

  return (
    <main className={`${styles.container}`}>
      <LocationContextProvider>
        {menuActive &&
          <SideNavigation
            activeView={activeView}
            SETTING_OPTIONS={SETTING_OPTIONS}
          />
        }
        <section className={styles.content}>
          <div className={styles.settings}>
            <Button text={'Settings'} onClick={toggleSettings} type='button' styleTypes={['secondary']} />
          </div>
          <h2>{capitalCase(getTitle(activeView))}</h2>
          {hasPermission(SETTING_OPTIONS[activeView]?.permissions) ?
            <ActiveContent />
            :
            <NoPermissionNotice />
          }
        </section>
      </LocationContextProvider>
    </main>
  )
}

export default UserSettings
