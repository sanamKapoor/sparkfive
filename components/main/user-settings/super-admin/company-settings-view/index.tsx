import moment from "moment";
import React from "react";
import { Utilities } from "../../../../../assets";
import Button from "../../../../common/buttons/button";
import IconClickable from "../../../../common/buttons/icon-clickable";
import Input from "../../../../common/inputs/input";
import OptionList from "../option-list";

import { ITeam, ITeamPlan } from "../../../../../types/team/team";
import styles from "../index.module.css";

import {
  collectionSharedLink,
  type,
} from "../../../../../config/data/super-admin";
import superAdminApi from "../../../../../server-api/super-admin";
import toastUtils from "../../../../../utils/toast";

interface CompanySettingsViewProps {
  onBack: () => void;
  detail: ITeam;
  setLoading: (val: boolean) => void;
  vanity: boolean;
  setVanity: (val: boolean) => void;
  subdomain: string;
  setSubdomain: (val: string) => void;
  cdnAccess: boolean;
  setCdnAccess: (val: boolean) => void;
  advancedCollectionShareLink: boolean;
  setAdvanceShareLink: (val: boolean) => void;
  transcript: boolean;
  setTranscript: (val: boolean) => void;
  setPlanDetail: (val: ITeamPlan) => void;
  setShowPlanModal: (val: boolean) => void;
}

const CompanySettingsView: React.FC<CompanySettingsViewProps> = ({
  onBack,
  detail,
  setLoading,
  vanity,
  setVanity,
  subdomain,
  setSubdomain,
  cdnAccess,
  setCdnAccess,
  advancedCollectionShareLink,
  setAdvanceShareLink,
  transcript,
  setTranscript,
  setPlanDetail,
  setShowPlanModal,
}) => {
  const updateTeam = async (data: any) => {
    if (detail) {
      try {
        setLoading(true);
        // @ts-ignore
        await superAdminApi.updateCompanyConfig(detail.id, data);

        setLoading(false);

        onBack();

        toastUtils.success("Setting changes saved");
      } catch (e) {
        setLoading(false);
        console.log(e.response.data?.message);
        toastUtils.error(e.response.data?.message || "Internal server error");
      }
    }
  };
  const getStatusBadge = (status) => {
    if (status === "active") {
      return <span className={styles["active-badge"]}>{status}</span>;
    }

    return <span className={styles["trial-badge"]}>{status}</span>;
  };

  return (
    <>
      <div className={styles.back} onClick={onBack}>
        <IconClickable src={Utilities.back} />
        <span>Back to all accounts</span>
      </div>
      <div className={styles.container}>
        <ul className={styles.list}>
          <li>
            <div className={styles.row}>
              <div
                className={`${styles["name-email"]} ${styles["header-title"]}`}
              >
                <div>Company Name</div>
              </div>
              <div className={`${styles.company} ${styles["header-title"]}`}>
                Account Senior Admin
              </div>
              <div className={`${styles.role} ${styles["header-title"]}`}>
                Plan
              </div>
              <div className={`${styles.role} ${styles["header-title"]}`}>
                Status
              </div>
              <div className={`${styles.role} ${styles["header-title"]}`}>
               Expired date
              </div>
              <div className={`${styles.role} ${styles["header-title"]}`}>
            Action
              </div>
            </div>
          </li>

          <li>
            <div className={styles.row}>
              <div className={`${styles["name-email"]}`}>
                <div>{detail?.company}</div>
              </div>
              <div className={`${styles.company}`}>
                <div>{detail?.users[0]?.name}</div>
                <div>{detail?.users[0]?.email}</div>
              </div>
              <div className={`${styles.role}`}>
                <p>{detail?.plan?.name}</p>
                {/* <p>{getStatusBadge(detail?.plan?.status)}</p>
                {detail?.plan?.endDate && (
                  <p>
                    End at {moment(detail?.plan?.endDate).format("DD/MM/YYYY")}
                  </p>
                )}

                <Button
                  className={"container exclude-min-height primary"}
                  type={"button"}
                  text="Edit"
                  onClick={() => {
                    setPlanDetail(detail?.plan);
                    setShowPlanModal(true);
                  }}
                  disabled={false}
                /> */}
              </div>
              <div>
              <p>{getStatusBadge(detail?.plan?.status)}</p>
               </div>
              <div>
              {detail?.plan?.endDate && (
                  <p>
                    End at {moment(detail?.plan?.endDate).format("DD/MM/YYYY")}
                  </p>
                )}
              </div>
              <div>
              <Button
                  className={"container exclude-min-height primary"}
                  type={"button"}
                  text="Edit"
                  onClick={() => {
                    setPlanDetail(detail?.plan);
                    setShowPlanModal(true);
                  }}
                  disabled={false}
                />

              </div>
            </div>
          </li>
        </ul>
      </div>
      <div className={styles.features}>
      <div className={`${styles["header-title"]} m-t-40 m-b-20`}>
        Added Features
      </div>
      <div className={"row align-flex-start"}>
        <div className={"col-20 font-weight-600"}>Vanity Url</div>
        <div className={"col-20"}>
          <OptionList
            data={type}
            oneColumn={false}
            value={vanity}
            setValue={(value) => {
              setVanity(value);
            }}
          />
        </div>
        {vanity && (
          <>
            <div className={"col-40"}>
              <label className={styles.label} htmlFor={"link"}>
                Custom Subdomain Name
              </label>
              <Input
                id={"link"}
                onChange={(e) => {
                  setSubdomain(e.target.value);
                }}
                value={subdomain}
                additionalClasses={"font-14"}
                placeholder={"Link URL"}
                styleType={"regular-height-short"}
              />
            </div>
          </>
        )}

        <div className={"col-20 align-self-flex-end"}>
          <Button
            className={"container exclude-min-height primary"}
            type={"button"}
            text="Save"
            onClick={() =>
              updateTeam({
                vanity,
                subdomain: vanity ? subdomain.split(".")[0] : "",
              })
            }
            disabled={false}
          />
        </div>
      </div>
      <div className={`row align-flex-start ${styles.cdnEmbedding}`}>
        <div className={"col-20 font-weight-600"}>CDN Embedding</div>

        <div className={"col-20"}>
          <OptionList
            setValue={(value) => setCdnAccess(value)}
            data={type}
            oneColumn={false}
            value={cdnAccess}
          />
        </div>

        <div className={"col-20 align-self-flex-end"}>
          <Button
            className={"container exclude-min-height primary"}
            type={"button"}
            text="Save"
            onClick={() => updateTeam({ cdnAccess })}
          />
        </div>
      </div>
      <div className={`row align-flex-start ${styles.cdnEmbedding}`}>
        <div className={"col-20 font-weight-600"}>
          Advance Collection Shared Links
        </div>

        <div className={"col-20"}>
          <OptionList
            setValue={(value) => setAdvanceShareLink(value)}
            data={collectionSharedLink}
            oneColumn={false}
            value={advancedCollectionShareLink}
          />
        </div>

        <div className={"col-20 align-self-flex-end"}>
          <Button
            className={"container exclude-min-height primary"}
            type={"button"}
            text="Save"
            onClick={() => updateTeam({ advancedCollectionShareLink })}
          />
        </div>
      </div>
      <div className={`row align-flex-start ${styles.cdnEmbedding}`}>
        <div className={"col-20 font-weight-600"}>Transcription</div>

        <div className={"col-20"}>
          <OptionList
            setValue={(value) => setTranscript(value)}
            data={type}
            oneColumn={false}
            value={transcript}
          />
        </div>

        <div className={"col-20 align-self-flex-end"}>
          <Button
            className={"container exclude-min-height primary"}
            type={"button"}
            text="Save"
            onClick={() => updateTeam({ transcript })}
          />
        </div>
      </div>

      </div>
     
    </>
  );
};

export default CompanySettingsView;
