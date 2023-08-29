import dateFnsFormat from "date-fns/format";
import dateFnsParse from "date-fns/parse";
import { useState } from "react";
import { DateUtils } from "react-day-picker";
import DayPickerInput from "react-day-picker/DayPickerInput";
import styles from "./index.module.css";

import dateStyles from "../../../common/filter/date-uploaded.module.css";

// Components
import Button from "../../../common/buttons/button";
import CompanyList from "./company-list";
import UserList from "./user-list";

import { useQueryStrings } from "../../../../hooks/use-query-strings";
import superAdminApi from "../../../../server-api/super-admin";
import toastUtils from "../../../../utils/toast";
import SpinnerOverlay from "../../../common/spinners/spinner-overlay";

import Select from "../../../common/inputs/select";
import Base from "../../../common/modals/base";
import { defaultSortData as companyDefaultSortData } from "./company-list-header/types";

import {
  collectionSharedLink,
  defaultValues,
  type,
} from "../../../../config/data/super-admin";
import { statuses } from "../../../../constants/plans";
import { ITeamPlan } from "../../../../types/team/team";
import CompanySettingsView from "./company-settings-view";

const SuperAdmin: React.FC = () => {
  const [viewCompanyDetail, setViewCompanyDetail] = useState(null);
  const [vanity, setVanity] = useState(type[1].value);
  const [cdnAccess, setCdnAcces] = useState(type[1].value);
  const [transcript, setTranscript] = useState(type[1].value);
  const [advancedCollectionShareLink, setAdvanceShareLink] = useState(
    collectionSharedLink[1].value
  );
  const [subdomain, setSubdomain] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [sortData, setSortData] = useQueryStrings(defaultValues);
  const [showPlanModal, setShowPlanModal] = useState<boolean>(false);
  const [planDetail, setPlanDetail] = useState<ITeamPlan | null>(null);
  const [benefits, setBenefits] = useState([]);

  const onViewCompanySettings = (data, benefits) => {
    setViewCompanyDetail(data);
    setVanity(data.vanity);
    setSubdomain(
      data.subdomain
        ? `${data.subdomain || ""}.${window.location.hostname.replace(
            "www.",
            ""
          )}`
        : ""
    );
    setCdnAcces(data.cdnAccess);
    setAdvanceShareLink(data.advancedCollectionShareLink);
    setBenefits(
      benefits.map((benefit) => {
        return {
          label: benefit.id,
          value: benefit.id,
        };
      })
    );
  };

  const onBack = () => {
    setViewCompanyDetail(undefined);
  };

  const updateTeamPlan = async (data: any) => {
    if (viewCompanyDetail) {
      try {
        setLoading(true);
        // @ts-ignore
        await superAdminApi.updateCompanyPlan(viewCompanyDetail.id, data);

        setLoading(false);

        onBack();

        setShowPlanModal(false);

        toastUtils.success("Setting changes saved");
      } catch (e) {
        setLoading(false);
        console.log(e.response.data?.message);
        toastUtils.error(e.response.data?.message || "Internal server error");
      }
    }
  };

  const parseDate = (str, format, locale) => {
    const parsed = dateFnsParse(str, format, new Date(), { locale });
    if (DateUtils.isDate(parsed)) {
      return parsed;
    }
    return undefined;
  };
  const formatDate = (date, format, locale) => {
    return dateFnsFormat(date, format, { locale });
  };

  const FORMAT = "MM/dd/yyyy";

  const onSelectBenefit = (selected) => {
    setPlanDetail({ ...planDetail, benefitId: selected.value });
  };

  const onSelectStatus = (selected) => {
    setPlanDetail({ ...planDetail, status: selected.value });
  };

  const onSelectDate = (key, value) => {
    setPlanDetail({ ...planDetail, [key]: value });
  };

  const updatePlan = () => {
    // @ts-ignore
    const { status, benefitId, endDate } = planDetail;
    updateTeamPlan({
      status,
      benefitId,
      endDate,
    });
  };

  return (
    <div className={(styles.container, styles.posRelative)}>
      {viewCompanyDetail ? (
        <CompanySettingsView
          onBack={onBack}
          detail={viewCompanyDetail}
          setLoading={setLoading}
          vanity={vanity}
          setVanity={setVanity}
          subdomain={subdomain}
          setSubdomain={setSubdomain}
          cdnAccess={cdnAccess}
          setCdnAccess={setCdnAcces}
          advancedCollectionShareLink={advancedCollectionShareLink}
          setAdvanceShareLink={setAdvanceShareLink}
          transcript={transcript}
          setTranscript={setTranscript}
          setPlanDetail={setPlanDetail}
          setShowPlanModal={setShowPlanModal}
        />
      ) : (
        <>
          <div className={styles.buttons}>
            <Button
              text="All Users"
              className={
                sortData.activeList === "allUsers"
                  ? "section-container section-active"
                  : "section-container"
              }
              onClick={() => setSortData(defaultValues)}
            />
            <Button
              text="All Accounts"
              className={
                sortData.activeList === "allAccounts"
                  ? "section-container section-active"
                  : "section-container"
              }
              onClick={() => setSortData(companyDefaultSortData)}
            />
          </div>

          {sortData.activeList === "allUsers" && <UserList />}
          {sortData.activeList === "allAccounts" && (
            <CompanyList onViewCompanySettings={onViewCompanySettings} />
          )}
        </>
      )}
      <Base
        modalIsOpen={showPlanModal}
        closeModal={() => {
          setShowPlanModal(false);
        }}
        additionalClasses={[styles["base-plan-modal"]]}
      >
        <div className={styles["plan-modal"]}>
          <div className={styles.adminModal}>
            <span className={styles.settings}>Settings</span>
          <span
            className={`${styles.close}`}
            onClick={() => {
              setShowPlanModal(false);
            }}
          >
            X
          </span>
          </div>
          <hr className={styles.divider}></hr>
          <div className={styles["form-field"]}>
            <div className={styles["form-title"]}>Plan</div>
            <Select
              options={benefits}
              additionalClass={"font-weight-normal primary-input-height"}
              onChange={(selected) => {
                onSelectBenefit(selected);
              }}
              placeholder={`Select the plan`}
              styleType="regular"
              value={
                benefits.filter(
                  (benefit) => benefit.value === planDetail?.benefitId
                )[0]
              }
            />
          </div>

          <div className={styles["form-field"]}>
            <div className={styles["form-title"]}>Status</div>
            <Select
              options={statuses}
              additionalClass={"font-weight-normal primary-input-height"}
              onChange={(selected) => {
                onSelectStatus(selected);
              }}
              placeholder={`Status`}
              styleType="regular"
              value={
                statuses.filter(
                  (status) => status.value === planDetail?.status
                )[0]
              }
            />
          </div>

          <div className={`${styles["form-field"]} ${styles["date-wrapper"]}`}>
            <div className={styles["form-title"]}>Expired at</div>
            <DayPickerInput
              formatDate={formatDate}
              format={FORMAT}
              parseDate={parseDate}
              onDayChange={(day) => {
                onSelectDate("endDate", day);
              }}
              placeholder={"mm/dd/yyyy"}
              classNames={{
                container: dateStyles.input,
                overlay: "",
                overlayWrapper: "",
              }}
              dayPickerProps={{
                className: dateStyles.calendar,
              }}
              value={planDetail?.endDate ? new Date(planDetail?.endDate) : ""}
            />
          </div>

          <div className={"d-flex justify-center"}>
            <Button
              className={"container exclude-min-height secondary"}
              type={"button"}
              text="Cancel"
              onClick={() => {
                setShowPlanModal(false);
              }}
            />
            <Button
              className={"container m-l-10 exclude-min-height primary"}
              type={"button"}
              text="Save Changes"
              onClick={() => {
                updatePlan();
              }}
            />
          </div>
        </div>
      </Base>
      {loading && <SpinnerOverlay />}
    </div>
  );
};

export default SuperAdmin;
