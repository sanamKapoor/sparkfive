import { useContext, useEffect } from "react";
import { TeamContext } from "../../../../../context";
import styles from "./index.module.css";

// Components
import { TEAM_PROFILE_PIC_HELP_TEXT } from "../../../../../constants/strings";
import PhotoUpload from "../../../../common/account/photo-upload";
import AddressForm from "./address-form";
import NameForm from "./name-form";

const Company: React.FC = () => {
  const { getTeam, team } = useContext(TeamContext);

  useEffect(() => {
    getTeam();
  }, []);

  return (
    <div>
      <NameForm />
      <PhotoUpload
        userPhoto={team?.workspaceIcon}
        description={TEAM_PROFILE_PIC_HELP_TEXT}
        type={"team"}
      />
      <div className={styles.divider}></div>
      <AddressForm />
    </div>
  );
};

export default Company;
