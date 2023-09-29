import styles from "./CsvBtn.module.css";
import React from "react";
import { Utilities } from "../../../../../assets";
import Button from "../../../../common/buttons/button";
import ButtonIcon from "../../../../common/buttons/button-icon";
const CsvBtn: React.FC<CsvBtnProps> = ({onClick}) => {
 
return (
    <>
      <Button onClick={onClick} className={"downloadBtn"} text="Download CSV"/>
      <div className={styles.downloadIcon}>
      <ButtonIcon onClick={onClick} text=""  icon={Utilities.download} additionalClass={styles.downloadBtn}   className={"downloadBtn"}/>

      </div>
    
    </>
  );
};
interface CsvBtnProps{onClick: ( ) => void;}
export default CsvBtn;
