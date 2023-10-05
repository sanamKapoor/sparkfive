import { useContext } from "react";
import { tabsData } from "../../../config/data/custom-settings";
import { SUPERADMIN_ACCESS } from "../../../constants/permissions";
import { UserContext } from "../../../context";
import SwitchableTabs from "../switchable-tabs";

const Main: React.FC = () => {
  const { hasPermission } = useContext(UserContext);

  const isSuperAdmin = hasPermission([SUPERADMIN_ACCESS]);
  return (
    <SwitchableTabs
      initialActiveTab={isSuperAdmin ? "sizeSaPresets" : "customViews"}
      data={tabsData}
    />
  );
};

export default Main;
