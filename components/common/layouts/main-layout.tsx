import Link from "next/link";
import Router from "next/router";
import { useContext, useRef, useState } from "react";
import { GeneralImg, Navigation } from "../../../assets";
import {
  ASSET_UPLOAD_APPROVAL,
  SETTINGS_TEAM,
  SUPERADMIN_ACCESS,
} from "../../../constants/permissions";
import { LoadingContext, TeamContext, UserContext } from "../../../context";
import cookiesUtils from "../../../utils/cookies";
import styles from "./main-layout.module.css";

// Components
import Button from "../buttons/button";
import AdmDropdown from "../inputs/adm-dropdown";
import Dropdown from "../inputs/dropdown";
import HeaderLink from "../layouts/header-link";
import NoPermissionNotice from "../misc/no-permission-notice";
import ToggleableAbsoluteWrapper from "../misc/toggleable-absolute-wrapper";
import TrialReminderModal from "../modals/trial-reminder-modal";
import Notification from "../notifications/notification";
import SpinnerOverlay from "../spinners/spinner-overlay";
import UserPhoto from "../user/user-photo";

const MainLayout = ({ children, requiredPermissions = [] }) => {
  const { user, logOut, hasPermission } = useContext(UserContext);
  const { isLoading } = useContext(LoadingContext);
  const pageListRef = useRef(null);

  const { plan } = useContext(TeamContext);

  const [menuOpen, setMenuOpen] = useState(false);

  const SettingsLink = ({ settingRef, name }) => (
    <Link href={`/main/user-settings/${settingRef}`}>
      <a>
        <li>
          <span></span>
          <span>{name}</span>
        </li>
      </a>
    </Link>
  );

  const MainLink = ({ settingRef, name }) => (
    <Link href={`/main/${settingRef}`}>
      <a>
        <li>
          <span></span>
          <span>{name}</span>
        </li>
      </a>
    </Link>
  );

  const adminJWT = cookiesUtils.get("adminToken");

  const getBackToAdmin = async () => {
    cookiesUtils.setUserJWT(adminJWT);
    cookiesUtils.remove("adminToken");
    Router.reload();
  };

  const admDropdownOptions = [
    {
      OverrideComp: () => <SettingsLink name="Account" settingRef="account" />,
    },
  ];

  const settingsDropdownOptions = [];

  if (hasPermission([SETTINGS_TEAM]))
    admDropdownOptions.push({
      OverrideComp: () => <SettingsLink name="Team" settingRef="team" />,
    });
  admDropdownOptions.push({
    OverrideComp: () => (
      <SettingsLink name="Notifications" settingRef="notifications" />
    ),
  });
  admDropdownOptions.push({
    OverrideComp: () => (
      <SettingsLink name="Integrations" settingRef="integrations" />
    ),
  });
  if (hasPermission([SETTINGS_TEAM]))
    settingsDropdownOptions.push({
      OverrideComp: () => (
        <SettingsLink name="Attributes" settingRef="attributes" />
      ),
    });
  settingsDropdownOptions.push({
    OverrideComp: () => (
      <MainLink name="Upload Approvals" settingRef="upload-approvals" />
    ),
  });
  settingsDropdownOptions.push({
    OverrideComp: () => (
      <SettingsLink name="Shared Links" settingRef="shared-links" />
    ),
  });
  if (hasPermission([SETTINGS_TEAM]))
    settingsDropdownOptions.push({
      OverrideComp: () => (
        <SettingsLink name="Custom Settings" settingRef="custom-settings" />
      ),
    });
  if (hasPermission([SUPERADMIN_ACCESS]))
    settingsDropdownOptions.push({
      OverrideComp: () => (
        <SettingsLink name="Super Admin" settingRef="super-admin" />
      ),
    });

  return (
    <>
      {user && (
        <>
          <header id={"main-header"} className={styles.header}>
            <Link
              href={
                plan?.type === "marketing_hub"
                  ? "/main/overview"
                  : "/main/assets"
              }
            >
              <a>
                <img className={styles["logo-img"]} src={GeneralImg.logo} />
              </a>
            </Link>
            <div className={styles["mobile-navigation-links"]}>
              <div onClick={() => setMenuOpen(true)}>
                <HeaderLink
                  href={""}
                  active={Router.pathname.indexOf("assets") !== -1}
                  img={
                    Router.pathname.indexOf("assets") !== -1
                      ? Navigation.assetsSelected
                      : Navigation.assets
                  }
                  imgHover={Navigation.assetsSelected}
                  text="Assets"
                />
              </div>
              {menuOpen && (
                <Dropdown
                  additionalClass={styles["menu-dropdown"]}
                  onClickOutside={() => setMenuOpen(false)}
                  options={[
                    {
                      id: "assets",
                      label: "Assets",
                      onClick: () => {},
                    },
                    {
                      id: "insights",
                      label: "Insights",
                      onClick: () => {},
                    },
                    {
                      id: "templates",
                      label: "Templates",
                      onClick: () => {},
                    },
                  ]}
                />
              )}
            </div>
            <ul className={styles["navigation-links"]} ref={pageListRef}>
              {plan?.type === "marketing_hub" && (
                <HeaderLink
                  active={Router.pathname.indexOf("overview") !== -1}
                  href="/main/overview"
                  img={
                    Router.pathname.indexOf("overview") !== -1
                      ? Navigation.overviewSelected
                      : Navigation.overview
                  }
                  imgHover={Navigation.overviewSelected}
                  text="Overview"
                />
              )}
              <HeaderLink
                active={Router.pathname.indexOf("assets") !== -1}
                href="/main/assets"
                img={
                  Router.pathname.indexOf("assets") !== -1
                    ? Navigation.assetsSelected
                    : Navigation.assets
                }
                imgHover={Navigation.assetsSelected}
                text="Assets"
              />
              <HeaderLink
                active={Router.pathname.indexOf("insights") !== -1}
                href="/main/insights"
                img={
                  Router.pathname.indexOf("insights") !== -1
                    ? Navigation.assetsSelected
                    : Navigation.assets
                }
                imgHover={Navigation.assetsSelected}
                text="Insights"
              />
              <HeaderLink
                active={Router.pathname.indexOf("templates") !== -1}
                href="/main/templates"
                img={
                  Router.pathname.indexOf("templates") !== -1
                    ? Navigation.assetsSelected
                    : Navigation.assets
                }
                imgHover={Navigation.assetsSelected}
                text="Templates"
              />
              {plan?.type === "marketing_hub" && (
                <HeaderLink
                  active={Router.pathname.indexOf("schedule") !== -1}
                  href="/main/schedule"
                  img={
                    Router.pathname.indexOf("schedule") !== -1
                      ? Navigation.scheduleSelected
                      : Navigation.schedule
                  }
                  imgHover={Navigation.scheduleSelected}
                  text="Schedule"
                />
              )}
            </ul>
            {hasPermission([ASSET_UPLOAD_APPROVAL]) && (
              <div className={styles["upload-approval"]}>
                <Button
                  text="Upload for approval"
                  type="button"
                  className="container primary"
                  onClick={() => Router.push("/main/upload-approval")}
                />
              </div>
            )}
            <div className={styles["notifications-wrapper"]}>
              <Notification />
            </div>

            <ToggleableAbsoluteWrapper
              wrapperClass={styles.user}
              Wrapper={({ children }) => (
                <>
                  <UserPhoto
                    photoUrl={user.profilePhoto}
                    extraClass={styles.profile}
                    sizePx={35}
                  />
                  {children}
                </>
              )}
              contentClass={styles["user-dropdown"]}
              Content={() => (
                <AdmDropdown
                  admOptions={admDropdownOptions}
                  settingsOptions={settingsDropdownOptions}
                  user={user}
                  logout={{ label: "Log Out", onClick: logOut }}
                />
              )}
            />
          </header>
          {isLoading && <SpinnerOverlay />}
          {hasPermission(requiredPermissions) ||
          hasPermission([ASSET_UPLOAD_APPROVAL]) ? (
            children
          ) : (
            <NoPermissionNotice />
          )}
          {adminJWT && (
            <div className={styles["superadmin-back"]}>
              <Button
                text="Go back to Superadmin"
                type="button"
                className="container secondary"
                onClick={getBackToAdmin}
              />
            </div>
          )}
          <footer className={styles.footer}>
            <TrialReminderModal />
          </footer>
        </>
      )}
    </>
  );
};

export default MainLayout;
