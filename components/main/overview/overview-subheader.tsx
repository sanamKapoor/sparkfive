import styles from "./overview-subheader.module.css";

import { ProjectTypes } from "../../../assets";

// Components
import NavDropdownButton from "../../common/buttons/nav-dropdown-button";
import SubHeader from "../../common/layouts/sub-header";

const OverviewSubHeader = ({ status = "", openCreateOVerlay }) => {
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

  return (
    <SubHeader
      pageTitle="Dashboard"
      inputDisabled={true}
      additionalClass={styles["overview-sub-heading"]}
    >
      <div className={styles["header-additional"]}></div>
      <NavDropdownButton
        text="Create New"
        onClick={() => openCreateOVerlay()}
        options={dropdownOptions}
      />
    </SubHeader>
  );
};

export default OverviewSubHeader;
