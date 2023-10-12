import Router from "next/router";

import { useEffect, useState } from "react";
import { useQueryStrings } from "../../../../../hooks/use-query-strings";
import { IUserResponseData } from "../../../../../interfaces/user/user";
import { defaultSortData } from "../../super-admin/user-list/types";
import TableHeader from "../Listheader/TableHeader";
import TableHead from "./TableHead";
import TableData from "./Tabledata";
import styles from "./UserTable.module.css";

import superAdminApi from "../../../../../server-api/super-admin";
import cookiesUtils from "../../../../../utils/cookies";

import { saveAs } from "file-saver";

import {
  FAILED_TO_DOWNLOAD_USERS,
  USERS_DOWNLOADED,
} from "../../../../../constants/messages";
import toastUtils from "../../../../../utils/toast";
import Button from "../../../../common/buttons/button";
import SpinnerOverlay from "../../../../common/spinners/spinner-overlay";

const UserTable = () => {
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

  const searchAndGetUsers = (searchTerm: string) => {
    console.log("searchTerm: ", searchTerm);
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
    <div className={styles.tableWrapper}>
      <div className={styles.outer}>
        <TableHeader
          headerText="All Users"
          onDownload={downloadUserDetails}
          onSearch={searchAndGetUsers}
          placeholder="Search User"
        />
        <table className={styles.userTable}>
          <TableHead sortData={sortData} setSortData={setSortData} />
          <TableData users={userData.users} onUserLogin={getUserJWT} />
        </table>
      </div>
      {userData.total > userData.users.length && (
        <div className={styles.loadMore}>
          <Button
            text="Load More"
            onClick={getMore}
            className="container primary"
          />
        </div>
      )}
      {loading && <SpinnerOverlay />}
    </div>
  );
};
export default UserTable;
