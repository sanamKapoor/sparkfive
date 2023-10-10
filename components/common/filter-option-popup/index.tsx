//🚧 work in progress 🚧
import React, { useEffect, useState } from "react";

import { Utilities } from "../../../assets";

import IconClickable from "../buttons/icon-clickable";
import styles from "./index.module.css"
import search from "../../common/attributes/search-input";
import Search from "../../common/inputs/search";
import OptionData from "./options-data";
import Button from "../buttons/button";
import Select from "../inputs/select";
import { sorts } from "../../../config/data/attributes";
import Divider from "./divider";
import SelectOption from "./select-option";


const FilterOptionPopup = () => {
 
  return (
    <>
    <div className={`${styles['outer-wrapper']}`}>
      <div className={`${styles['popup-header']}`}>
      <span className={`${styles['main-heading']}`} > Select Tag</span>
      <div className={styles.buttons}>
          <button  className={styles.clear}>clear</button>
          <img  src={Utilities.closeIcon} />
        </div>
    </div>
    <div  className={`${styles['search-btn']}`}>
    <Search/>
  </div>
 
     
     

      {/* <input value="" placeholder="Search Tags...." />
          {values.map((value) => {
            return (
              <>
                <IconClickable src={Utilities.radioButtonNormal} />
                <span>{value.name}</span>
                <span>{value.count}</span>
                <></>
              </>
            );
          })} */}
        <OptionData/>
        <div className={`${styles['rule-tag']}`}>
      <label>Rule:</label>
     <SelectOption/> 
        </div>
        <Divider/>
        <div className={`${styles['Modal-btn']}`}>
        <Button className={"apply"}  text={"Apply"} />
        <Button className={"cancel"} text={"Cancel"}></Button>
      </div>
    </div>
   
     </>
  );
};

export default FilterOptionPopup ;