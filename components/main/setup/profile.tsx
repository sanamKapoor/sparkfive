import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context";
import userApi from "../../../server-api/user";
import styles from "./profile.module.css";

// Components
import PhotoUpload from "../../common/account/photo-upload";
import Input from "../../common/inputs/input";

const Profile = ({ ActionButtons }) => {
  const { user } = useContext(UserContext);
  const [currentName, setCurrentName] = useState("");

  useEffect(() => {
    if (user) {
      setCurrentName(user.name);
    }
  }, [user]);

  const onSave = async () => {
    try {
      await userApi.patchUser({ name: currentName });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles["profile-photo"]}>
          <p>1. Upload a New Profile Photo</p>
          <PhotoUpload userPhoto={user?.profilePhoto} />
        </div>
        <div className={styles["client-name"]}>
          <p>2. Confirm Your Name</p>
          <Input
            value={currentName}
            onChange={(e) => setCurrentName(e.target.value)}
          />
        </div>
      </div>
      <ActionButtons saveAction={onSave} />
    </>
  );
};

export default Profile;
