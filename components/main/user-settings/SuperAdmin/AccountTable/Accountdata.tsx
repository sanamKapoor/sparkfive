import { ITeam } from "../../../../../interfaces/team/team";
import styles from "./Accountdata.module.css";

import fileSize from "filesize";
import dateUtils from "../../../../../utils/date";
import { checkIfPLanIsActive } from "../../../../../utils/team";
import Button from "../../../../common/buttons/button";

interface AccountDataProps {
  accounts: ITeam[];
  benefits: Array<unknown>; //TODO: fix type
  onSettingsOpen: (account: ITeam, benefits) => void;
}

const AccountData: React.FC<AccountDataProps> = ({
  accounts,
  benefits,
  onSettingsOpen,
}) => {
  return (
    <>
      {accounts.map((account, index) => {
        return (
          <tr
            className={
              index % 2 === 0
                ? styles.tabledata
                : `${styles.tabledata} ${styles.active}`
            }
            key={account.id}
          >
            <td>
              <span className={styles.useremail}>
                {account.company || "No Company Name"}
              </span>
            </td>
            <td>
              <div className={styles.content}>
                <span className={styles.username}>
                  {account.users[0]?.name}
                </span>
                <span className={styles.useremail}>
                  {account.users[0]?.email}
                </span>
              </div>
            </td>
            <td>
              <span className={styles.useremail}>
                {dateUtils.parseDateToString(account.users[0].lastLogin)}
              </span>
            </td>
            <td>
              <span className={styles.useremail}>
                {dateUtils.parseDateToString(account.users[0].createdAt)}
              </span>
            </td>
            <td>
              <span className={styles.useremail}>
                {dateUtils.parseDateToString(account.users[0].lastUpload)}
              </span>
            </td>
            <td>
              <span className={styles.username}>
                {fileSize(account.users[0]?.storageUsed).replace(" ", "")}
              </span>
            </td>
            <td>
              <span className={styles.username}>
                {account.users[0]?.filesCount}
              </span>
            </td>
            <td>
              <span className={styles.useremail}>{account.plan?.name}</span>
            </td>
            <td>
              <span
                className={
                  checkIfPLanIsActive(account?.plan?.name)
                    ? `${styles["active-badge"]}`
                    : `${styles["expired-badge"]}`
                }
              >
                {checkIfPLanIsActive(account?.plan?.name)
                  ? "Active"
                  : "Expired"}
              </span>
            </td>
            <td className={styles.logbtn}>
              <Button
                text="Settings"
                className={"actionBtn"}
                onClick={(e) => onSettingsOpen(account, benefits)}
              />
            </td>
          </tr>
        );
      })}
    </>
  );
};
export default AccountData;
