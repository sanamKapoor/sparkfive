import React from "react";
import Base from "../../../../common/modals/base";

import DayPickerInput from "react-day-picker/DayPickerInput";
import { statuses } from "../../../../../constants/plans";
import { ITeamPlan } from "../../../../../types/team/team";
import Button from "../../../../common/buttons/button";
import Select from "../../../../common/inputs/select";
import styles from "../../super-admin/index.module.css";

import dateFnsFormat from "date-fns/format";
import dateFnsParse from "date-fns/parse";

import { DateUtils } from "react-day-picker";

import dateStyles from "../../../../common/filter/date-uploaded.module.css";

interface PlanModalProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  plan: ITeamPlan;
  setPlan: (plan: ITeamPlan) => void;
  benefits: Array<unknown>;
  updatePlan: () => void;
}

const PlanModal: React.FC<PlanModalProps> = ({
  isOpen,
  setIsOpen,
  plan,
  benefits,
  setPlan,
  updatePlan,
}) => {
  const onSelectBenefit = (selected) => {
    setPlan({ ...plan, benefitId: selected.value });
  };

  const onSelectStatus = (selected) => {
    setPlan({ ...plan, status: selected.value });
  };

  const onSelectDate = (key, value) => {
    setPlan({ ...plan, [key]: value });
  };

  //TODO: move to a separate file
  const formatDate = (date, format, locale) => {
    return dateFnsFormat(date, format, { locale });
  };

  //TODO: move to a separate file
  const parseDate = (str, format, locale) => {
    const parsed = dateFnsParse(str, format, new Date(), { locale });
    if (DateUtils.isDate(parsed)) {
      return parsed;
    }
    return undefined;
  };

  const FORMAT = "MM/dd/yyyy";

  return (
    <Base
      modalIsOpen={isOpen}
      closeModal={() => {
        setIsOpen(false);
      }}
      additionalClasses={[styles["base-plan-modal"]]}
    >
      <div className={styles["plan-modal"]}>
        <span
          className={`${styles.close}`}
          onClick={() => {
            setIsOpen(false);
          }}
        >
          x
        </span>
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
                (benefit) => benefit?.value === plan?.benefitId
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
              statuses.filter((status) => status.value === plan?.status)[0]
            }
          />
        </div>

        <div className={`${styles["form-field"]} ${styles["date-wrapper"]}`}>
          <div className={styles["form-title"]}>Expired At</div>
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
            }}
            dayPickerProps={{
              className: dateStyles.calendar,
            }}
            value={plan?.endDate ? new Date(plan?.endDate) : ""}
          />
        </div>

        <div className={"d-flex justify--flex-end"}>
          <Button
            className="container secondary exclude-min-height"
            text="Cancel"
            onClick={() => {
              setIsOpen(false);
            }}
          />
          <Button
            className={"container m-l-10 exclude-min-height primary"}
            text="Save Changes"
            onClick={() => {
              updatePlan();
            }}
          />
        </div>
      </div>
    </Base>
  );
};

export default PlanModal;
