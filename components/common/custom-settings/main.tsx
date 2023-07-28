import { useContext, useState } from "react";
import styles from "./main.module.css";

// Components
import { UserContext } from "../../../context";
import Button from "../../common/buttons/button";
import CustomFileSizes from "./custom-file-size";
import SizeSaPresets from "./size-sa-presets";

import { SUPERADMIN_ACCESS } from "../../../constants/permissions";
import Links from "../guest-upload/links";
import AccountActions from "./account-actions";
import AdvancedOptions from "./advanced-options";
import Automations from "./automations";
import CustomViews from "./custom-views";
import DeletedAssetsLibrary from "./deleted-assets";

const Main = () => {
  const { hasPermission } = useContext(UserContext);
  const [activeList, setActiveList] = useState("advancedOptions");

  return (
    <>
      <div className={styles.buttons}>
        <Button
          text="Advanced Options"
          className={
            activeList === "advancedOptions"
              ? "section-container section-active"
              : "section-container"
          }
          onClick={() => setActiveList("advancedOptions")}
        />
        {hasPermission([SUPERADMIN_ACCESS]) && (
          <Button
            text="Size SA Presets"
            className={
              activeList === "sizeSaPresets"
                ? "section-container section-active"
                : "section-container"
            }
            onClick={() => setActiveList("sizeSaPresets")}
          />
        )}
        <Button
          text="Custom Views"
          className={
            activeList === "customViews"
              ? "section-container section-active"
              : "section-container"
          }
          onClick={() => setActiveList("customViews")}
        />
        <Button
          text="Account Actions"
          className={
            activeList === "accountActions"
              ? "section-container section-active"
              : "section-container"
          }
          onClick={() => setActiveList("accountActions")}
        />
        <Button
          text="Automations"
          className={
            activeList === "automations"
              ? "section-container section-active"
              : "section-container"
          }
          onClick={() => setActiveList("automations")}
        />
        <Button
          text="Custom File Sizes"
          className={
            activeList === "customFileSizes"
              ? "section-container section-active"
              : "section-container"
          }
          onClick={() => setActiveList("customFileSizes")}
        />
        <Button
          text="Guest Upload Links"
          className={
            activeList === "guestUpload"
              ? "section-container section-active"
              : "section-container"
          }
          onClick={() => setActiveList("guestUpload")}
        />
        <Button
          text="Deleted Assets"
          className={
            activeList === "deletedAssets"
              ? "section-container section-active"
              : "section-container"
          }
          onClick={() => setActiveList("deletedAssets")}
        />
      </div>

      <div className={styles.content}>
        {activeList === "customViews" && <CustomViews />}
        {activeList === "accountActions" && <AccountActions />}
        {activeList === "automations" && <Automations />}
        {activeList === "advancedOptions" && <AdvancedOptions />}
        {activeList === "customFileSizes" && <CustomFileSizes />}
        {activeList === "guestUpload" && <Links />}
        {activeList === "deletedAssets" && <DeletedAssetsLibrary />}
        {activeList === "sizeSaPresets" &&
          hasPermission([SUPERADMIN_ACCESS]) && <SizeSaPresets />}
      </div>
    </>
  );
};

export default Main;
