import styles from "./nested-sidenav-dropdown.module.css";
import { Utilities } from "../../assets";
import React, { useState } from "react";
import Draggable from "react-draggable";
import NestedButton from "./button";
import Dropdown from "../common/inputs/dropdown";

const NestedSidenavDropdown = ({folders}) => {

  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);
  const [isNatureOpen, setIsNatureOpen] = useState(false);
  const [isFoodOpen, setIsFoodOpen] = useState(false);
console.log(folders,"folders")
  const toggleArchitecture = () => {
    setIsArchitectureOpen(!isArchitectureOpen);
  };
  const toggleNature = () => {
    setIsNatureOpen(!isNatureOpen);
  };

  const toggleFood = () => {
    setIsFoodOpen(!isFoodOpen);
  };

  return (
    <div>
      <ul>
{folders.map((item)=>{
  return(
    <>
    <img className={styles.rightIcon} src={Utilities.right} />

<li className={styles.dropdownMenu}>

<div
  className={`${styles["dropdown-lists"]} ${styles.active}`}
  onClick={toggleArchitecture}
>

  <div className={styles.dropdownIcons}>
    <img src={Utilities.folder} />
    <div className={styles["icon-descriptions"]}>
      <span>{item.name}</span>
    </div>
  </div>
  <div className={styles["list1-right-contents"]}>
    <span>{item.assetsCount}</span>
  </div>
</div>
{/* {isArchitectureOpen && (
  <div className={styles.subfolderList}>
    
      <div className={styles.dropdownOptions}>
        <div className={styles["folder-lists"]}>
          <div className={styles.dropdownIcons}>
            <img
              className={styles.subfolder}
              src={Utilities.folder}
            />
            <div className={styles["icon-descriptions"]}>
              <span>City</span>
            </div>
          </div>
          <div className={styles["list1-right-contents"]}>
            <span>7</span>
          </div>
        </div>
      </div>
    
      <div className={styles.dropdownOptions}>
        <div className={styles["folder-lists"]}>
          <div className={styles.dropdownIcons}>
            <img
              className={styles.subfolder}
              src={Utilities.folder}
            />
            <div className={styles["icon-descriptions"]}>
              <span>Renaissance</span>
            </div>
          </div>
          <div className={styles["list1-right-contents"]}>
            <span>7</span>
          </div>
        </div>
      </div>
    
    <div className={styles.dropdownOptions}>
      <div className={styles["folder-lists"]}>
        <div className={styles.dropdownIcons}>
          <img className={styles.subfolder} src={Utilities.folder} />
          <div className={styles["icon-descriptions"]}>
            <span>Interior</span>
          </div>
        </div>
        <div className={styles["list1-right-contents"]}>
          <span>23</span>
        </div>
      </div>
    </div>
    
      <div className={styles.dropdownOptions}>
        <div className={styles["folder-lists"]}>
          <div className={styles.dropdownIcons}>
            <img
              className={styles.subfolder}
              src={Utilities.folder}
            />
            <div className={styles["icon-descriptions"]}>
              <span>House</span>
            </div>
          </div>
          <div className={styles["list1-right-contents"]}>
            <span>29</span>
          </div>
        </div>
      </div>
    <NestedButton>Add Subcollection</NestedButton>
  </div>
   )} */}
   </li>
    </>
    
   
  )

})}
        
        <NestedButton>Add collection</NestedButton>
      </ul>
    </div>
  );
};

export default NestedSidenavDropdown;
