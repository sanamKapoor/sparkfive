import { useContext } from "react";
import { UserContext } from "../../../../context";
import styles from "./request.module.css";

// Components

const Request = ({ id, email, name, onChange }) => {
  const { user } = useContext(UserContext);
  return (
    <li className={styles.container}>
      <div className={styles["name-email"]}>
        <div>{email}</div>
      </div>
      <div className={styles.role}>{name}</div>
      <div className={styles.details}>
        {user.id !== id && (
          <>
            <div
              onClick={() => {
                onChange("review");
              }}
              className={styles.action}
            >
              Review
            </div>
            <div
              onClick={() => {
                onChange("accept");
              }}
              className={styles.action}
            >
              Approve
            </div>
            <div
              onClick={() => {
                onChange("reject");
              }}
              className={styles.action}
            >
              Reject
            </div>
          </>
        )}
      </div>
    </li>
  );
};

export default Request;
