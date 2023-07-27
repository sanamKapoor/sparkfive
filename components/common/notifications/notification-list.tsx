import { format } from "date-fns";
import Router from "next/router";
import { ItemFields, Utilities } from "../../../assets";
import styles from "./notification-list.module.css";

const NotificationList = ({
  notifications,
  onClear = (notif) => {},
  onMarkRead = (notif) => {},
  mode = "header",
}) => (
  <div className={`${styles.list} ${styles[mode]}`}>
    <div className={styles.title}>Recent Notifications</div>
    <ul>
      {notifications.length === 0 && (
        <div className={styles.empty}>
          <img src={Utilities.thumbsUp} />
          <span>You’re all set! No new notifications</span>
        </div>
      )}
      {notifications.map((notification) => {
        const content = JSON.parse(notification.item).content;
        let formattedContent;

        if (mode === "header") {
          if (content) {
            formattedContent =
              content.length > 65
                ? `"${content.substring(0, 65)}..."`
                : `"${content}"`;
          } else {
            formattedContent = content;
          }
        }

        const date = new Date(notification.timestamp * 1000);

        const urlIndex = notification.url.indexOf("/main");
        const realUrl = notification.url.substring(
          urlIndex,
          notification.url.length
        );

        return (
          <li className={styles.notification} key={notification.notifId}>
            <div className={`${styles[notification.status]}`}></div>
            <div className={styles.date}>
              <div>{format(date, "MMM d")}</div>
              <div>{format(date, "p")}</div>
            </div>
            {mode === "page" && (
              <div className={styles.member}>
                <img src={ItemFields.member} alt="member icon" />
              </div>
            )}
            <div onClick={() => Router.replace(realUrl)}>
              <div className={styles.message}>{notification.message}</div>
              <div className={styles.content}>{formattedContent}</div>
            </div>
            <div
              className={styles.action}
              onClick={
                mode === "header"
                  ? () => onClear(notification)
                  : () => onMarkRead(notification)
              }
            >
              {mode === "header" ? "clear" : "mark as seen"}
            </div>
          </li>
        );
      })}
    </ul>
  </div>
);

export default NotificationList;
