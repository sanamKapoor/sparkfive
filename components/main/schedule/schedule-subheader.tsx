import { addMonths, format, startOfMonth, subMonths } from "date-fns";
import styles from "./schedule-subheader.module.css";

import { ProjectTypes } from "../../../assets";

// Components
import NavDropdownButton from "../../common/buttons/nav-dropdown-button";
import SubHeader from "../../common/layouts/sub-header";

const ScheduleSubHeader = ({
  openCreateOVerlay,
  displayDate,
  setCurrentDate,
}) => {
  const dropdownOptions = [
    {
      label: "Campaign",
      onClick: () => openCreateOVerlay("campaign"),
      icon: ProjectTypes.campaign,
    },
    {
      label: "Project",
      onClick: () => openCreateOVerlay("project"),
      icon: ProjectTypes.project,
    },
    {
      label: "Task",
      onClick: () => openCreateOVerlay("task"),
      icon: ProjectTypes.task,
    },
  ];

  const setNextMonth = () => {
    setCurrentDate(startOfMonth(addMonths(displayDate, 1)));
  };

  const setPreviousMonth = () => {
    setCurrentDate(startOfMonth(subMonths(displayDate, 1)));
  };

  // TODO: Change page title to date
  return (
    <SubHeader pageTitle={displayDate && format(displayDate, "MMM yyyy")}>
      <div className={styles["header-additional"]}>
        <div onClick={setPreviousMonth}>{"<"}</div>
        <div onClick={setNextMonth}>{">"}</div>
      </div>
      <NavDropdownButton text="Create New" options={dropdownOptions} />
    </SubHeader>
  );
};

export default ScheduleSubHeader;
