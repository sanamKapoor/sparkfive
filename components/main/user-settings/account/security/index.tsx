import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../../context";
import userApi from "../../../../../server-api/user";
import toastUtils from "../../../../../utils/toast";
import styles from "./index.module.css";

// Components
import {
  ENABLE_TWO_AUTH_FOR_SECURITY,
  SECURITY_SUBTITLE,
  SECURITY_TITLE,
} from "../../../../../constants/strings";
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
       <div className={`${styles['container']} ${styles['security-container-wrapper']}`}>
      <UserPreference
        enabled={user?.twoFactor}
        setPreference={setTwoFactor}
        title={SECURITY_TITLE}
        subtitle={SECURITY_SUBTITLE}
        description={ENABLE_TWO_AUTH_FOR_SECURITY}
      />
    </div>
  );
};

export default Notifications;
