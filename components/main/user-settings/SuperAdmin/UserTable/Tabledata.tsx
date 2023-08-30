import { IUser } from "../../../../../types/user/user";
import styles from "./Tabledata.module.css";

import dateUtils from "../../../../../utils/date";
import Button from "../../../../common/buttons/button";

interface TableDataProps {
  users: IUser[];
  onUserLogin: (user: IUser) => void;
}

const TableData: React.FC<TableDataProps> = ({ users, onUserLogin }) => {
  return (
    <>
      {users.map((user, index) => {
        return (
          <tr
            className={
              index % 2 === 0
                ? `${styles.tabledata}`
                : `${styles.tabledata} ${styles.active}`
            }
            key={user.id}
          >
            <td>
              <div className={styles.content}>
                <span className={styles.username}>{user.name}</span>
                <span className={styles.useremail}>{user.email}</span>
              </div>
            </td>
            <td>
              <span className={styles.useremail}>
                {dateUtils.parseDateToString(user.lastLogin)}
              </span>
            </td>
            <td>
              <span className={styles.useremail}>
                {dateUtils.parseDateToString(user.createdAt)}
              </span>
            </td>
            <td>
              <span className={styles.useremail}>
                {user.roleId !== "user" &&
                user.roleId !== "admin" &&
                user.roleId !== "super_admin"
                  ? "Custom Role"
                  : user.roleId}
              </span>
            </td>
            <td>
              <span className={styles.username}>
                {user.team.company || "No company name"}
              </span>
            </td>
            {/* TODO: fix styling */}
            <td className={styles.logbtn}>
              <Button text="User Login" onClick={(e) => onUserLogin(user)} />
            </td>
          </tr>
        );
      })}
    </>
  );
};
export default TableData;
