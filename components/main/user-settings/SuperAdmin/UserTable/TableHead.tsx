import { Utilities } from "../../../../../assets";
import { SortData, defaultSortData } from "../../super-admin/user-list/types";
import styles from "./TableHead.module.css";

interface TableHeadProps {
  sortData: SortData; //TODO: fix type
  setSortData: (val: SortData) => void;
}

const TableHead: React.FC<TableHeadProps> = ({ sortData, setSortData }) => {
  const onSort = (sortId: string) =>
    setSortData({
      ...defaultSortData,
      sortBy: sortId,
      sortDirection:
        sortId !== sortData.sortBy
          ? "ASC"
          : sortData.sortDirection === "ASC"
          ? "DESC"
          : "ASC",
    });

  return (
    <>
      <tr className={styles.headdata}>
        <th className={styles.username}>
          <div className={styles.thead}>
            <span> User name</span>
            <img
              className={styles.image}
              src={Utilities.updown}
              onClick={() => onSort("users.name")}
            />
          </div>
        </th>
        <th className={styles.headcontent}>
          <div className={styles.thead}>
            <span> Last Login</span>
            <img
              className={styles.image}
              src={Utilities.updown}
              onClick={() => onSort("users.lastLogin")}
            />
          </div>
        </th>
        <th className={styles.headcontent}>
          <div className={styles.thead}>
            <span> Created at</span>
            <img
              className={styles.image}
              src={Utilities.updown}
              onClick={() => onSort("users.createdAt")}
            />
          </div>
        </th>
        <th>
          <div className={styles.thead}>
            <span> Role</span>
            <img
              className={styles.image}
              src={Utilities.updown}
              onClick={() => onSort("users.roleId")}
            />
          </div>
        </th>
        <th>
          <div className={styles.thead}>
            <span> Company</span>
            <img
              className={styles.image}
              src={Utilities.updown}
              onClick={() => onSort("team.company")}
            />
          </div>
        </th>
         <th>
          <div className={styles.thead}>
            <span> Plan</span>
            <img
              className={styles.image}
              src={Utilities.updown}
           onClick={() => onSort("plan.name")}
            />
          </div>
        </th>
         <th>
          <div className={styles.thead}>
            <span> Status</span>
          </div>
        </th>
        <th className={styles.action}>Action</th>
      </tr>
    </>
  );
};
export default TableHead;