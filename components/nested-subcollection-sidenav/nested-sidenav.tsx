import styles from "./nested-sidenav.module.css";
import { Utilities } from "../../assets";
import React from "react";
import NestedFirstlist from "./nested-sidenav-firstlist";
import NestedSidenavDropdown from "./nested-sidenav-dropdown-list";
import ReusableHeading from "./nested-heading";
const NestedSidenav = () => {
  return (
    <div className={styles.nestedsidenav}>
      <div className={styles["sidenav-content"]}>
        <ReusableHeading
          text="Hooli Inc."
          icon={<img src={Utilities.arrowleft} />}
        />
        <NestedFirstlist />
        <ReusableHeading text="Collection (21)" icon={undefined} />
        <NestedSidenavDropdown />
      </div>
    </div>
  );
};

export default NestedSidenav;
