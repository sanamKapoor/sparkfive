import update from "immutability-helper";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context";
import notificationApi from "../../../../server-api/notification";
import userApi from "../../../../server-api/user";
import toastUtils from "../../../../utils/toast";
import styles from "./index.module.css";

import { COULD_NOT_CHANGE_PREFERENCE } from "../../../../constants/messages";
import {
  ENABLE_TWO_AUTH_FOR_NOTIFICATION,
  NOTIFICATIONS_SUBTITLE,
  NOTIFICATIONS_TITLE,
} from "../../../../constants/strings";
import UserPreference from "../../../common/account/user-preference";
import NotificationList from "../../../common/notifications/notification-list";
import { pages } from "../../../../constants/analytics";
import useAnalytics from "../../../../hooks/useAnalytics";

const Notifications: React.FC = () => {
  const { user, setUser } = useContext(UserContext);

  const [enableEmailNotification, setEnableEmailNotification] =
    useState<boolean>(false);

  const [notifications, setNotifications] = useState([]);

  const { pageVisit } = useAnalytics();

  useEffect(() => {    
    pageVisit(pages.NOTIFICATIONS)
  },[]);

  useEffect(() => {
    if (user) {
      setUserProperties();
      getPastNotifications();
    }
  }, [user]);

  const getPastNotifications = async () => {
    try {
      const {
        data: { notifications: dataNotifications },
      } = await notificationApi.getNotifications({ excludeCleared: "false" });
      setNotifications(dataNotifications);
    } catch (err) {
      console.log(err);
    }
  };

  const setUserProperties = () => {
    setEnableEmailNotification(user.notifEmail);
  };

  const handleChange = async (updateData) => {
    try {
      const { data } = await userApi.patchUser(updateData);
      setUser(data);
    } catch (err) {
      console.log(err);
      toastUtils.error(COULD_NOT_CHANGE_PREFERENCE);
    }
  };

  const setEmailNotif = (value) => {
    setEnableEmailNotification(value);
    handleChange({ notifEmail: value });
  };

  const markAsSeen = async (notification) => {
    try {
      await notificationApi.patchNotification({
        notifications: [{ ...notification, status: "seen" }],
      });
      const notificationIndex = notifications.findIndex(
        (notif) => notif.notifId === notification.notifId
      );
      setNotifications(
        update(notifications, {
          [notificationIndex]: {
            $merge: { status: "seen" },
          },
        })
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.divider}></div>
      <div className={styles.preferences}>
        <UserPreference
          enabled={enableEmailNotification}
          setPreference={setEmailNotif}
          title={NOTIFICATIONS_TITLE}
          subtitle={NOTIFICATIONS_SUBTITLE}
          description={ENABLE_TWO_AUTH_FOR_NOTIFICATION}
        />
      </div>
      <NotificationList
        notifications={notifications}
        mode={"page"}
        onMarkRead={markAsSeen}
      />
    </div>
  );
};

export default Notifications;
