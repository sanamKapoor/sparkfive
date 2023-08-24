import { capitalCase } from "change-case";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { UserContext } from "../../../context";
import LocationContextProvider from "../../../context/location-provider";
import urlUtils from "../../../utils/url";
import styles from "./index.module.css";

import {
  SETTINGS_COMPANY,
  SETTINGS_TEAM,
  SUPERADMIN_ACCESS,
} from "../../../constants/permissions";

// Components
import { Utilities } from "../../../assets";
import FilterProvider from "../../../context/filter-provider";
import IconClickable from "../../common/buttons/icon-clickable";
import NoPermissionNotice from "../../common/misc/no-permission-notice";
import Account from "./account";
import Attributes from "./attributes";
import CustomSettings from "./custom-settings";
import Integrations from "./integrations";
import Notifications from "./notifications";
import ShareLinks from "./share-links";
import SideNavigation from "./side-navigation";
import SuperAdmin from "./super-admin";
import Team from "./team";

export const SETTING_OPTIONS = {
  account: { label: "Account", permissions: [], content: Account },
  team: { label: "Team", permissions: [SETTINGS_TEAM], content: Team },
  notifications: {
    label: "Notifications",
    permissions: [],
    content: Notifications,
  },
  integrations: {
    label: "Integrations",
    permissions: [],
    content: Integrations,
  },
  attributes: {
    label: "Attributes",
    contentTitle: "Custom Attributes",
    permissions: [SETTINGS_TEAM, SETTINGS_COMPANY],
    content: Attributes,
  },
  ["shared-links"]: {
    label: "Shared Links",
    contentTitle: "Shared Links",
    permissions: [],
    content: ShareLinks,
  },
  ["custom-settings"]: {
    label: "Custom Settings",
    contentTitle: "Custom Settings",
    permissions: [SETTINGS_TEAM, SETTINGS_COMPANY],
    content: CustomSettings,
  },
  ["super-admin"]: {
    label: "Super Admin",
    permissions: [SUPERADMIN_ACCESS],
    content: SuperAdmin,
  },
};

const UserSettings: React.FC = () => {
  const { hasPermission } = useContext(UserContext);

  const router = useRouter();

  useEffect(() => {
    const activeView = urlUtils.getPathId();
    setActiveView(activeView);
  }, [router.query.view]);

  const [activeView, setActiveView] = useState<string>("");
  const [menuActive, setMenuActive] = useState<boolean>(true);

  let ActiveContent = () => <></>;
  if (SETTING_OPTIONS[activeView])
    ActiveContent = SETTING_OPTIONS[activeView].content;

  const toggleSettings = () => {
    setMenuActive(!menuActive);
  };

  useEffect(() => {
    if (isMobile) {
      setMenuActive(false);
    }
  }, []);

  const getTitle = (activeView) => {
    if (SETTING_OPTIONS[activeView]) {
      return SETTING_OPTIONS[activeView].contentTitle
        ? SETTING_OPTIONS[activeView].contentTitle
        : activeView;
    } else {
      return activeView;
    }
  };

  return (
    <main className={`${styles.container}`}>
      <LocationContextProvider>
        <FilterProvider>
          {menuActive && <SideNavigation activeView={activeView} />}
          <section className={styles.content}>
            <div className={styles.header}>
              <IconClickable src={Utilities.menu} onClick={toggleSettings} />
              <h2>{capitalCase(getTitle(activeView))}</h2>
            </div>
            {hasPermission(SETTING_OPTIONS[activeView]?.permissions) ? (
              <ActiveContent />
            ) : (
              <NoPermissionNotice />
            )}
          </section>
        </FilterProvider>
      </LocationContextProvider>
    </main>
  );
};

export default UserSettings;
