import moment from "moment";
import React, { useState } from "react";
import { Utilities } from "../../../../../assets";
import Button from "../../../../common/buttons/button";
import IconClickable from "../../../../common/buttons/icon-clickable";

import { ITeam, ITeamPlan } from "../../../../../interfaces/team/team";
import styles from "../index.module.css";

import superAdminApi from "../../../../../server-api/super-admin";
import toastUtils from "../../../../../utils/toast";
import Input from "../../../../common/inputs/input";
import PlanModal from "../../SuperAdmin/PlanModal";
import OptionList from "../option-list";

interface CompanySettingsViewProps {
  onBack: () => void;
  data: ITeam;
  loading: boolean;
  setLoading: (val: boolean) => void;
  benefits: Array<unknown>;
}

//TODO: move to a different file
const type = [
  {
    label: "On",
    value: true,
  },
  {
    label: "Off",
    value: false,
  },
];

const CompanySettingsView: React.FC<CompanySettingsViewProps> = ({ onBack, data, loading, setLoading, benefits }) => {
  console.log("team data: ", data);
  const [settings, setSettings] = useState({
    vanity: data?.vanity,
    subdomain: data?.subdomain,
    cdnAccess: data?.cdnAccess,
    advancedCollectionShareLink: data?.advancedCollectionShareLink,
    transcript: data?.transcript,
    ocr: data?.ocr,
    themeCustomization: data?.themeCustomization || false,
  });
  const [showPlanModal, setShowPlanModal] = useState<boolean>(false);

  const [currentPlan, setCurrentPlan] = useState<ITeamPlan>();

  const updateTeam = async () => {
    if (data) {
      try {
        setLoading(true);
        // @ts-ignore
        await superAdminApi.updateCompanyConfig(data.id, settings);

        setLoading(false);

        onBack();

        toastUtils.success("Setting changes saved");
      } catch (e) {
        setLoading(false);
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

  const updatePlan = async () => {
    try {
      setLoading(true);
      // @ts-ignore

      const { status, benefitId, endDate } = currentPlan;
      await superAdminApi.updateCompanyPlan(data.id, {
        status,
        benefitId,
        endDate,
      });

      setLoading(false);

      onBack();

      setShowPlanModal(false);

      toastUtils.success("Setting changes saved");
    } catch (e) {
      console.log(e.response.data?.message);
      toastUtils.error(e.response.data?.message || "Internal server error");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className={styles.back} onClick={onBack}>
        <IconClickable SVGElement={Utilities.back} />
        <span>Back to all accounts</span>
      </div>
      <div className={styles.container}>
        <ul className={styles.list}>
          <li>
            <div className={styles.row}>
              <div className={`${styles["name-email"]} ${styles["header-title"]}`}>
                <div>Company Name</div>
              </div>
              <div className={`${styles.company} ${styles["header-title"]}`}>Account Senior Admin</div>
              <div className={`${styles.role} ${styles["header-title"]}`}>Plan</div>
              <div className={`${styles.role} ${styles["header-title"]}`}>Status</div>
              <div className={`${styles.role} ${styles["header-title"]}`}>Expired date</div>
              <div className={`${styles.role} ${styles["header-title"]}`}>Action</div>
            </div>
          </li>

          <li>
            <div className={styles.row}>
              <div className={`${styles["name-email"]}`}>
                <div>{data?.company}</div>
              </div>
              <div className={`${styles.company}`}>
                <div>{data?.users[0]?.name}</div>
                <div>{data?.users[0]?.email}</div>
              </div>
              <div className={`${styles.role}`}>
                <p>{data?.plan?.name}</p>
              </div>
              <div>
                <p>{getStatusBadge(data?.plan?.status)}</p>
              </div>
              <div>{data?.plan?.endDate && <p>End at {moment(data?.plan?.endDate).format("DD/MM/YYYY")}</p>}</div>
              <div>
                <Button
                  className={"container exclude-min-height primary"}
                  type={"button"}
                  text="Edit"
                  onClick={() => {
                    setCurrentPlan(data?.plan);
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
        <div className={`${styles["header-title"]} m-t-40 m-b-20`}>Added Features</div>
        <div className={"row align-flex-start"}>
          <div className={"col-20 font-weight-600"}>Vanity Url</div>
          <div className={"col-20"}>
            <OptionList
              data={type}
              oneColumn={false}
              value={settings.vanity}
              setValue={(value) => {
                setSettings({ ...settings, vanity: value });
              }}
            />
          </div>
          {settings.vanity && (
            <>
              <div className={"col-40"}>
                <label className={styles.label} htmlFor={"link"}>
                  Custom Subdomain Name
                </label>
                <Input
                  id={"link"}
                  onChange={(e) => {}}
                  value={settings.subdomain}
                  additionalClasses={"font-14"}
                  placeholder={"Link URL"}
                  styleType={"regular-height-short"}
                />
              </div>
            </>
          )}

          <div className={"col-20 align-self-flex-end"}></div>
        </div>
        <div className={`row align-flex-start ${styles.cdnEmbedding}`}>
          <div className={"col-20 font-weight-600"}>CDN Embedding</div>

          <div className={"col-20"}>
            <OptionList
              setValue={(value) => setSettings({ ...settings, cdnAccess: value })}
              data={type}
              oneColumn={false}
              value={settings.cdnAccess}
            />
          </div>

          <div className={"col-20 align-self-flex-end"}></div>
        </div>
        <div className={`row align-flex-start ${styles.cdnEmbedding}`}>
          <div className={"col-20 font-weight-600"}>Advance Collection Shared Links</div>

          <div className={"col-20"}>
            <OptionList
              setValue={(value) => setSettings({ ...settings, advancedCollectionShareLink: value })}
              data={type}
              oneColumn={false}
              value={settings.advancedCollectionShareLink}
            />
          </div>

          <div className={"col-20 align-self-flex-end"}></div>
        </div>
        <div className={`row align-flex-start ${styles.cdnEmbedding}`}>
          <div className={"col-20 font-weight-600"}>Transcription</div>

          <div className={"col-20"}>
            <OptionList
              setValue={(value) => setSettings({ ...settings, transcript: value })}
              data={type}
              oneColumn={false}
              value={settings.transcript}
            />
          </div>

          <div className={"col-20 align-self-flex-end"}></div>
        </div>
        <div className={`row align-flex-start ${styles.cdnEmbedding}`}>
          <div className={"col-20 font-weight-600"}>Text Recognition</div>

          <div className={"col-20"}>
            <OptionList
              setValue={(value) => setSettings({ ...settings, ocr: value })}
              data={type}
              oneColumn={false}
              value={settings.ocr}
            />
          </div>

          <div className={"col-20 align-self-flex-end"}></div>
        </div>

        <div className={`row align-flex-start ${styles.cdnEmbedding}`}>
          <div className={"col-20 font-weight-600"}>Theme Customization</div>

          <div className={"col-20"}>
            <OptionList
              setValue={(value) => setSettings({ ...settings, themeCustomization: value })}
              data={type}
              oneColumn={false}
              value={settings.themeCustomization}
            />
          </div>

          <div className={"col-20 align-self-flex-end"}></div>
        </div>

        <div className={styles.featuresbtn}>
          <Button
            className={"container exclude-min-height primary"}
            type={"button"}
            text="Save"
            onClick={() => updateTeam()}
          />
        </div>
      </div>
      <PlanModal
        isOpen={showPlanModal}
        setIsOpen={setShowPlanModal}
        plan={currentPlan}
        setPlan={setCurrentPlan}
        benefits={benefits}
        updatePlan={updatePlan}
      />
    </>
  );
};

export default CompanySettingsView;
