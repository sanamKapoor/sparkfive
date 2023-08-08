import { useContext, useState } from "react";
import styles from "./main.module.css";

// Components
import { UserContext } from "../../../context";
import Button from "../../common/buttons/button";
import CustomFileSizes from "./custom-file-size";
import SizeSaPresets from "./size-sa-presets";

import { capitalCase } from "change-case";
import { SUPERADMIN_ACCESS } from "../../../constants/permissions";
import { CustomSettingsTabs } from "../../../types/common/tabs";
import Links from "../guest-upload/links";
import AccountActions from "./account-actions";
import AdvancedOptions from "./advanced-options";
import Automations from "./automations";
import CustomViews from "./custom-views";
import DeletedAssetsLibrary from "./deleted-assets";

const Main: React.FC = () => {
  const { hasPermission } = useContext(UserContext);
  const [activeList, setActiveList] = useState("advancedOptions");

  return (
    <>
      <div className={styles.buttons}>
        <Button
          text={capitalCase(CustomSettingsTabs.ADVANCED_OPTIONS)}
          className={
            activeList === CustomSettingsTabs.ADVANCED_OPTIONS
              ? "section-container section-active"
              : "section-container"
          }
          onClick={() => setActiveList(CustomSettingsTabs.ADVANCED_OPTIONS)}
        />
        {hasPermission([SUPERADMIN_ACCESS]) && (
          <Button
            text={capitalCase(CustomSettingsTabs.SIZE_SA_PRESETS)}
            className={
              activeList === CustomSettingsTabs.SIZE_SA_PRESETS
                ? "section-container section-active"
                : "section-container"
            }
            onClick={() => setActiveList(CustomSettingsTabs.SIZE_SA_PRESETS)}
          />
        )}
        <Button
          text={capitalCase(CustomSettingsTabs.CUSTOM_VIEWS)}
          className={
            activeList === CustomSettingsTabs.CUSTOM_VIEWS
              ? "section-container section-active"
              : "section-container"
          }
          onClick={() => setActiveList(CustomSettingsTabs.CUSTOM_VIEWS)}
        />
        <Button
          text={capitalCase(CustomSettingsTabs.ACCOUNT_ACTIONS)}
          className={
            activeList === CustomSettingsTabs.ACCOUNT_ACTIONS
              ? "section-container section-active"
              : "section-container"
          }
          onClick={() => setActiveList(CustomSettingsTabs.ACCOUNT_ACTIONS)}
        />
        <Button
          text={capitalCase(CustomSettingsTabs.AUTOMATIONS)}
          className={
            activeList === CustomSettingsTabs.AUTOMATIONS
              ? "section-container section-active"
              : "section-container"
          }
          onClick={() => setActiveList(CustomSettingsTabs.AUTOMATIONS)}
        />
        <Button
          text={capitalCase(CustomSettingsTabs.CUSTOM_FILE_SIZES)}
          className={
            activeList === CustomSettingsTabs.CUSTOM_FILE_SIZES
              ? "section-container section-active"
              : "section-container"
          }
          onClick={() => setActiveList(CustomSettingsTabs.CUSTOM_FILE_SIZES)}
        />
        <Button
          text={capitalCase(CustomSettingsTabs.GUEST_UPLOAD)}
          className={
            activeList === CustomSettingsTabs.GUEST_UPLOAD
              ? "section-container section-active"
              : "section-container"
          }
          onClick={() => setActiveList(CustomSettingsTabs.GUEST_UPLOAD)}
        />
        <Button
          text={capitalCase(CustomSettingsTabs.DELETED_ASSETS)}
          className={
            activeList === CustomSettingsTabs.DELETED_ASSETS
              ? "section-container section-active"
              : "section-container"
          }
          onClick={() => setActiveList(CustomSettingsTabs.DELETED_ASSETS)}
        />
      </div>

      <div className={styles.content}>
        {activeList === CustomSettingsTabs.CUSTOM_VIEWS && <CustomViews />}
        {activeList === CustomSettingsTabs.ACCOUNT_ACTIONS && (
          <AccountActions />
        )}
        {activeList === CustomSettingsTabs.AUTOMATIONS && <Automations />}
        {activeList === CustomSettingsTabs.ADVANCED_OPTIONS && (
          <AdvancedOptions />
        )}
        {activeList === CustomSettingsTabs.CUSTOM_FILE_SIZES && (
          <CustomFileSizes />
        )}
        {activeList === CustomSettingsTabs.GUEST_UPLOAD && <Links />}
        {activeList === CustomSettingsTabs.DELETED_ASSETS && (
          <DeletedAssetsLibrary />
        )}
        {activeList === CustomSettingsTabs.SIZE_SA_PRESETS &&
          hasPermission([SUPERADMIN_ACCESS]) && <SizeSaPresets />}
      </div>
    </>
  );
};

export default Main;
