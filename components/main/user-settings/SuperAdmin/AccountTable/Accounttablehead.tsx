import { Utilities } from "../../../../../assets";
import { defaultSortData } from "../../super-admin/company-list-header/types";
import { SortData } from "../../super-admin/user-list/types";
import styles from "./Accounttablehead.module.css";

interface AccountTableHeadProps {
  sortData: SortData;
  setSortData: (val: SortData) => void;
}

const AccountTableHead: React.FC<AccountTableHeadProps> = ({ sortData, setSortData }) => {
  const onSort = (sortId: string) => {
    setSortData({
      ...defaultSortData,
      sortBy: sortId,
      sortDirection: sortData.sortDirection === "ASC" ? "DESC" : "ASC",
    });
  };
  return (
    <>
      <tr className={styles.headdata}>
        <th className={styles.username}>
          <div className={styles.thead}>
            <span> Company</span>
            <Utilities.updown className={styles.image} onClick={() => onSort("teams.company")} />
          </div>
        </th>
        <th className={styles.headcontent}>
          <div className={styles.thead}>
            <span> Senior admin</span>
            <Utilities.updown className={styles.image} onClick={() => onSort("users.name")} />
          </div>
        </th>
        <th className={styles.headcontent}>
          <div className={styles.thead}>
            <span> Last login</span>
            <Utilities.updown className={styles.image} onClick={() => onSort("users.lastLogin")} />
          </div>
        </th>
        <th>
          <div className={styles.thead}>
            <span> Created at</span>
            <Utilities.updown className={styles.image} onClick={() => onSort("users.createdAt")} />
          </div>
        </th>
        <th>
          <div className={styles.thead}>
            <span> Last upload</span>
            <Utilities.updown className={styles.image} onClick={() => onSort("users.lastUpload")} />
          </div>
        </th>
        <th>
          <div className={styles.thead}>
            <span> Storage used</span>
            <Utilities.updown className={styles.image} onClick={() => onSort("users.storageUsed")} />
          </div>
        </th>
        <th>
          <div className={styles.thead}>
            <span> Files upload</span>
            <Utilities.updown className={styles.image} onClick={() => onSort("users.filesCount")} />
          </div>
        </th>
        <th>
          <div className={styles.thead}>
            <span> Plan</span>
            <Utilities.updown className={styles.image} onClick={() => onSort("plan.name")} />
          </div>
        </th>

        <th className={styles.status}>
          <div className={styles.thead}>
            <span> Status</span>
          </div>
        </th>
        <th className={styles.action}>Action</th>
      </tr>
    </>
  );
};
export default AccountTableHead;
