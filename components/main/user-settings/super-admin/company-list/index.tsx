import { saveAs } from "file-saver";
import { useEffect, useState } from "react";
import superAdminApi from "../../../../../server-api/super-admin";
import styles from "./index.module.css";

// Components
import { AssetOps } from "../../../../../assets";
import {
  ACCOUNTS_DOWNLOADED,
  FAILED_TO_DOWNLOAD_ACCOUNTS,
} from "../../../../../constants/messages";
import { useQueryStrings } from "../../../../../hooks/use-query-strings";
import { ITeam, ITeamResponseData } from "../../../../../types/team/team";
import toastUtils from "../../../../../utils/toast";
import Button from "../../../../common/buttons/button";
import IconClickable from "../../../../common/buttons/icon-clickable";
import Search from "../../../../common/inputs/search";
import SpinnerOverlay from "../../../../common/spinners/spinner-overlay";
import CompanyItem from "../company-item";
import CompanyListHeader from "../company-list-header";
import { defaultSortData } from "../company-list-header/types";

interface CompanyListProps {
  onViewCompanySettings: (team: ITeam, benefits) => void;
}

const CompanyList: React.FC<CompanyListProps> = ({ onViewCompanySettings }) => {
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

  const searchAndGetUsers = (searchTerm) => {
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
    <div className={styles.container}>
      <div className={styles.listIcon}>
        <IconClickable
          tooltipId={"download_accounts"}
          src={AssetOps.download}
          onClick={downloadAccountDetails}
          tooltipText="Download All"
          place="bottom"
          additionalClass={styles["download-icon"]}
        />
      </div>
      <Search
        onSubmit={searchAndGetUsers}
        placeholder={"Search accounts by company name, admin name or email"}
      />
      <ul className={styles.list}>
        <li>
          <div className={styles.row}>
            <div
              className={`${styles["name-email"]} ${styles["header-title"]}`}
            >
              <CompanyListHeader
                setSortData={setSortData}
                sortData={sortData}
                sortId="teams.company"
                title="Company"
              />
            </div>
            <div className={`${styles.company} ${styles["header-title"]}`}>
              <CompanyListHeader
                setSortData={setSortData}
                sortData={sortData}
                sortId="users.name"
                title="Senior Admin"
              />
            </div>
            <div className={`${styles.date} ${styles["header-title"]}`}>
              <CompanyListHeader
                setSortData={setSortData}
                sortData={sortData}
                sortId="users.lastLogin"
                title="Last Login"
              />
            </div>
            <div className={`${styles.date} ${styles["header-title"]}`}>
              <CompanyListHeader
                setSortData={setSortData}
                sortData={sortData}
                sortId="users.createdAt"
                title="Created Date"
              />
            </div>
            <div className={`${styles.date} ${styles["header-title"]}`}>
              <CompanyListHeader
                setSortData={setSortData}
                sortData={sortData}
                sortId="users.lastUpload"
                title="Last Upload"
              />
            </div>
            <div className={`${styles.storage} ${styles["header-title"]}`}>
              <CompanyListHeader
                setSortData={setSortData}
                sortData={sortData}
                sortId="users.storageUsed"
                title="Storage Used"
              />
            </div>
            <div className={`${styles.files} ${styles["header-title"]}`}>
              <CompanyListHeader
                setSortData={setSortData}
                sortData={sortData}
                big
                sortId="users.filesCount"
                title="Files Upload"
              />
            </div>
            <div className={`${styles.plan} ${styles["header-title"]}`}>
              <CompanyListHeader
                setSortData={setSortData}
                sortData={sortData}
                sortId="plan.name"
                title="Plan"
              />
            </div>
            <div className={styles.btn} />
          </div>
        </li>
        {companyData.teams.map((team) => (
          <li key={`${team.id}-${team.users[0].id}`}>
            <CompanyItem
              team={team}
              onViewCompanySettings={() => {
                onViewCompanySettings(team, companyData.benefits);
              }}
            />
          </li>
        ))}
      </ul>
      {companyData.total > companyData.teams.length && (
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

export default CompanyList;
