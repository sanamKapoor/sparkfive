import styles from "./member.module.css";

import { capitalCase } from "change-case";
import { useContext } from "react";
import { UserContext } from "../../../../../../context";
import { ITeamMember } from "../../../../../../types/team/team";

interface IMemberProps extends Partial<ITeamMember> {
  editAction: () => void;
  deleteAction: () => void;
}

const Member: React.FC<IMemberProps> = ({
  id,
  email,
  role,
  name,
  editAction,
  deleteAction,
}) => {
  const { user } = useContext(UserContext);

  return (
    <li className={styles.container}>
      <div className={styles["name-email"]}>
        <div>{name}</div>
        <div>{email}</div>
      </div>
      <div className={styles.details_wrapper}>
        <div className={styles.details}>
          <div className={styles.role}>{capitalCase(role.name)}</div>
          <div className={styles.actions}>
            <div
              onClick={editAction}
              className={`${styles.action} ${
                user.id === id ? styles.hidden : ""
              }`}
            >
              Edit
            </div>
            <div
              onClick={deleteAction}
              className={`${styles.action} ${
                user.id === id ? styles.hidden : ""
              }`}
            >
              Delete
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default Member;
