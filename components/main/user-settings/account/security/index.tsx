import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../../context";
import userApi from "../../../../../server-api/user";
import toastUtils from "../../../../../utils/toast";
import styles from "./index.module.css";

// Components
import UserPreference from "../../../../common/account/user-preference";

const Notifications: React.FC = () => {
  const { user, setUser } = useContext(UserContext);

  const [enabledTwoFactor, setEnabledTwoFactor] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      setUserProperties();
    }
  }, [user]);

  const setUserProperties = () => {
    setEnabledTwoFactor(user.twoFactor);
  };

  const handleChange = async (updateData) => {
    try {
      const { data } = await userApi.patchUser(updateData);
      setUser(data);
    } catch (err) {
      console.log(err);
      toastUtils.error("Could not change preference, please try again later");
    }
  };

  const setTwoFactor = (value) => {
    setEnabledTwoFactor(value);
    handleChange({ twoFactor: value });
  };

  return (
    <div className={styles.container}>
      <h3>Security</h3>
      <UserPreference
        enabled={enabledTwoFactor}
        setPreference={setTwoFactor}
        title={"Two-Factor Authentication"}
        description={`Enabling this provides an extra layer of security for all users in your account. A security code wil be required in addition to your password`}
      />
    </div>
  );
};

export default Notifications;
