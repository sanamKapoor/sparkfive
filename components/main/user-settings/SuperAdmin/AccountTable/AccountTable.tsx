import { useQueryStrings } from "../../../../../hooks/use-query-strings";
import { ITeam, ITeamResponseData } from "../../../../../types/team/team";
import { defaultSortData } from "../../super-admin/company-list-header/types";
import AccountData from "../AccountTable/Accountdata";
import AccountTableHead from "../AccountTable/Accounttablehead";
import TableHeader from "../Listheader/TableHeader";

import { saveAs } from "file-saver";
import { useEffect, useState } from "react";

import styles from "./AccountTable.module.css";

import toastUtils from "../../../../../utils/toast";

import {
  ACCOUNTS_DOWNLOADED,
  FAILED_TO_DOWNLOAD_ACCOUNTS,
} from "../../../../../constants/messages";
import superAdminApi from "../../../../../server-api/super-admin";
import Button from "../../../../common/buttons/button";
import SpinnerOverlay from "../../../../common/spinners/spinner-overlay";
interface AccountDataProps {
  onViewCompanySettings: (account: ITeam, benefits) => void;
}

const AccountTable: React.FC<AccountDataProps> = ({
  onViewCompanySettings,
}) => {
  const [term, setTerm] = useState<string>("");
  const [termForDownload, setTermForDownload] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const [companyData, setCompanyData] = useState<ITeamResponseData>({
    teams: [],
    currentPage: 1,
    total: 0,
    benefits: [],
  });
  const [sortData, setSortData] = useQueryStrings(defaultSortData);

  useEffect(() => {
    if (Object.keys(sortData).length > 0) {
      getCompany({
        sortBy: sortData.sortBy,
        sortDirection: sortData.sortDirection,
        reset: true,
      });
    }
  }, [sortData]);

  const getCompany = async ({
    page = 1,
    searchTerm = term,
    reset = false,
    sortBy = "teams.company",
    sortDirection = "ASC",
  } = {}) => {
    try {
      setLoading(true);
      let newTeams = companyData.teams;
      if (reset) newTeams = [];

      const { data } = await superAdminApi.getCompanies({
        term: searchTerm,
        page,
        sortBy,
        sortOrder: sortDirection,
      });
      const { data: benefitData } = await superAdminApi.getBenefits();
      const teams = [...newTeams, ...data.teams];

      setCompanyData({
        teams,
        currentPage: page,
        total: data.total,
        benefits: benefitData,
      });

      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const searchAndGetAccounts = (searchTerm: string) => {
    getCompany({
      searchTerm,
      page: 1,
      reset: true,
      sortBy: sortData.sortBy,
      sortDirection: sortData.sortDirection,
    });
    setTerm(searchTerm);
    setTermForDownload(searchTerm);
  };

  const getMore = () => {
    getCompany({
      page: companyData.currentPage + 1,
      sortBy: sortData.sortBy,
      sortDirection: sortData.sortDirection,
    });
  };

  const downloadAccountDetails = async () => {
    try {
      setLoading(true);
      const res = await superAdminApi.downloadDetails({
        type: "accounts",
        term: termForDownload,
        sortBy: sortData.sortBy,
        sortOrder: sortData.sortDirection,
      });
      const fileData = new Blob([res.data], {
        type: "text/csv;charset=utf-8",
      });
      saveAs(fileData, `Accounts-Details-${new Date().getTime()}`);
      setLoading(false);
      toastUtils.success(ACCOUNTS_DOWNLOADED);
    } catch (err) {
      setLoading(false);
      toastUtils.error(FAILED_TO_DOWNLOAD_ACCOUNTS);
    }
  };

  return (
    <div className={styles.tableWrapper}>
      <div className={styles.outer}>
        <TableHeader
          headerText="All accounts"
          onDownload={downloadAccountDetails}
          onSearch={searchAndGetAccounts}
          placeholder="Search Account"
        />
        <table className={styles.userTable}>
          <AccountTableHead sortData={sortData} setSortData={setSortData} />
          <AccountData
            accounts={companyData.teams}
            benefits={companyData.benefits}
            onSettingsOpen={onViewCompanySettings}
          />
        </table>
      </div>
      {companyData.total > companyData.teams.length && (
        <Button
          text={"Load more"}
          onClick={getMore}
          type={"button"}
          className={"container primary"}
        />
      )}
      {loading && <SpinnerOverlay />}
    </div>
  );
};
export default AccountTable;
