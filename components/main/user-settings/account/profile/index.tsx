import { useContext } from "react";
import { UserContext } from "../../../../../context";
import styles from "./index.module.css";

// Components
import PhotoUpload from "../../../../common/account/photo-upload";
import Basic from "./basic";

const Profile: React.FC = () => {
  const { user } = useContext(UserContext);

  return (
    <div className={styles.container}>
      <h3 className={`${styles["account-profile-name"]}`}>Profile</h3>
      {user && (
        <>
          <div className={`${styles["account-profile-name"]}`}>
            <PhotoUpload userPhoto={user.profilePhoto} />
          </div>

          <div className={styles.divider}></div>
          <Basic email={user.email} name={user.name} provider={user.provider} />
        </>
      )}
    </div>
  );
};

export default Profile;
