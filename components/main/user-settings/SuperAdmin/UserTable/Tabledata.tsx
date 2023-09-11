import { IUser } from "../../../../../interfaces/user/user";
import styles from "./Tabledata.module.css";

import { capitalCase } from "change-case";
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
            <td>
              <span className={styles.username}>
                <span className={styles.useremail}>
                  {user?.team?.plan?.name}
                </span>
              </span>
            </td>
            <td>
              <span className={styles["active-badge"]}>
                {capitalCase(user?.team?.plan.status)}
              </span>
            </td>
            <td className={styles.logbtn}>
              <Button
                className={"actionBtn"}
                text="User Login"
                onClick={(e) => onUserLogin(user)}
              />
            </td>
          </tr>
        );
      })}
    </>
  );
};
export default TableData;
