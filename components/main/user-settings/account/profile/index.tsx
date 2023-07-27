import { useContext } from "react";
import { UserContext } from "../../../../../context";
import styles from "./index.module.css";

// Components
import PhotoUpload from "../../../../common/account/photo-upload";
import Basic from "./basic";

const Profile = () => {
  const { user, setUser } = useContext(UserContext);

  return (
    <div className={styles.container}>
      <h3>Profile</h3>
      {user && (
        <>
          <PhotoUpload userPhoto={user.profilePhoto} />
          <Basic email={user.email} name={user.name} provider={user.provider} />
        </>
      )}
    </div>
  );
};

export default Profile;
