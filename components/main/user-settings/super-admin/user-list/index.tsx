import Router from "next/router";
import { useEffect, useState } from "react";
import { useQueryStrings } from "../../../../../hooks/use-query-strings";
import superAdminApi from "../../../../../server-api/super-admin";
import cookiesUtils from "../../../../../utils/cookies";
import styles from "./index.module.css";
import { defaultSortData } from "./types";

// Components
import { AssetOps } from "../../../../../assets";
import Button from "../../../../common/buttons/button";
import Search from "../../../../common/inputs/search";
import SpinnerOverlay from "../../../../common/spinners/spinner-overlay";
import UserItem from "../user-item";
import UserListHeader from "../user-list-header";

import { saveAs } from "file-saver";
import {
  FAILED_TO_DOWNLOAD_USERS,
  USERS_DOWNLOADED,
} from "../../../../../constants/messages";
import { IUserResponseData } from "../../../../../types/user/user";
import toastUtils from "../../../../../utils/toast";
import IconClickable from "../../../../common/buttons/icon-clickable";

const UserList: React.FC = () => {
  const [term, setTerm] = useState<string>("");
  const [termForDownload, setTermForDownload] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(true);

  const [userData, setUserData] = useState<IUserResponseData>({
    users: [],
    currentPage: 1,
    total: 0,
  });
  const [sortData, setSortData] = useQueryStrings(defaultSortData);

  useEffect(() => {
    if (Object.keys(sortData).length) {
      getUsers({
        sortBy: sortData.sortBy,
        sortDirection: sortData.sortDirection,
        reset: true,
      });
    }
  }, [sortData]);

  const getUsers = async ({
    page = 1,
    searchTerm = term,
    reset = false,
    sortBy = "users.lastLogin",
    sortDirection = "ASC",
  } = {}) => {
    try {
      setLoading(true);
      let newUsers = userData.users;
      if (reset) newUsers = [];

      const { data } = await superAdminApi.getUsers({
        term: searchTerm,
        page,
        sortBy,
        sortOrder: sortDirection,
      });
      const users = [...newUsers, ...data.users];

      setUserData({
        users,
        currentPage: page,
        total: data.total,
      });
      console.groupEnd();
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const searchAndGetUsers = (searchTerm) => {
    getUsers({
      searchTerm,
      page: 1,
      reset: true,
      sortBy: sortData.sortBy,
      sortDirection: sortData.sortDirection,
    });
    setTerm(searchTerm);
    setTermForDownload(searchTerm);
  };

  const getUserJWT = async (user) => {
    try {
      const { data } = await superAdminApi.getUserJWT(user.id);
      // Place tokens in cookies to be able to return
      const adminJwt = cookiesUtils.get("jwt");
      cookiesUtils.set("adminToken", adminJwt);
      cookiesUtils.setUserJWT(data.token);
      await Router.replace("/main/overview");
      Router.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const getMore = () => {
    getUsers({
      page: userData.currentPage + 1,
      sortBy: sortData.sortBy,
      sortDirection: sortData.sortDirection,
    });
  };

  const downloadUserDetails = async () => {
    try {
      setLoading(true);
      const res = await superAdminApi.downloadDetails({
        type: "users",
        term: termForDownload,
        sortBy: sortData.sortBy,
        sortOrder: sortData.sortDirection,
      });
      const fileData = new Blob([res.data], {
        type: "text/csv;charset=utf-8",
      });
      saveAs(fileData, `Users-Details-${new Date().getTime()}`);
      setLoading(false);
      toastUtils.success(USERS_DOWNLOADED);
    } catch (err) {
      setLoading(false);
      toastUtils.error(FAILED_TO_DOWNLOAD_USERS);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.listIcon}>
        <IconClickable
          src={AssetOps.download}
          onClick={downloadUserDetails}
          tooltipText={"Download All"}
          tooltipId={"download_users"}
          place="bottom"
          additionalClass={styles["download-icon"]}
        />
      </div>
      <Search
        onSubmit={searchAndGetUsers}
        placeholder={"Search users by name or email"}
      />
      <ul className={styles.list}>
        <li>
          <div className={styles["header-container"]}>
            <div
              className={`${styles["centered-cell"]} ${styles["name-email"]}`}
            >
              <UserListHeader
                setSortData={setSortData}
                sortData={sortData}
                sortId="users.name"
                title="User"
              />
            </div>
            <div className={`${styles["centered-cell"]} ${styles.date}`}>
              <UserListHeader
                setSortData={setSortData}
                sortData={sortData}
                sortId="users.lastLogin"
                title="Last Login"
              />
            </div>
            <div className={`${styles["centered-cell"]} ${styles.date}`}>
              <UserListHeader
                setSortData={setSortData}
                sortData={sortData}
                sortId="users.createdAt"
                title="Created At"
              />
            </div>
            <div className={`${styles["centered-cell"]} ${styles.role}`}>
              <UserListHeader
                setSortData={setSortData}
                sortData={sortData}
                sortId="users.roleId"
                title="Role"
              />
            </div>
            <div className={`${styles["centered-cell"]} ${styles.company}`}>
              <UserListHeader
                setSortData={setSortData}
                sortData={sortData}
                sortId="team.company"
                title="Company"
              />
            </div>
            <div className={styles.button} />{" "}
            {/*it needs to implement button column width*/}
          </div>
        </li>
        {userData.users.map((user) => (
          <li key={user.id}>
            <UserItem getUserToken={() => getUserJWT(user)} user={user} />
          </li>
        ))}
      </ul>
      {userData.total > userData.users.length && (
        <div className={styles.action}>
          <Button
            text={"Load more"}
            onClick={getMore}
            type={"button"}
            className={"container primary"}
          />
        </div>
      )}

      {loading && <SpinnerOverlay />}
    </div>
  );
};

export default UserList;
