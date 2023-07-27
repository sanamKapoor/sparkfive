import { useContext, useEffect } from "react";
import { TeamContext } from "../../../../../context";
import styles from "./index.module.css";

// Components
import PhotoUpload from "../../../../common/account/photo-upload";
import AddressForm from "./address-form";
import NameForm from "./name-form";

const Company = () => {
  const { getTeam, team } = useContext(TeamContext);

  useEffect(() => {
    getTeam();
  }, []);

  return (
    <div>
      <NameForm />
      <PhotoUpload
        userPhoto={team?.workspaceIcon}
        explainText={`Your company's icon appears in shared collections`}
        type={"team"}
      />

      <div className={styles.divider}></div>
      <AddressForm />
    </div>
  );
};

export default Company;
