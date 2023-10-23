import { useState } from "react";
import { Utilities } from "../../../assets";
import IconClickable from "../buttons/icon-clickable";
import styles from "./asset-note.module.css";

const AssetNote = ({ title, note }) => {
  const [show, setShow] = useState(true);

  return (
    <div className={`${styles.container} ${!show ? styles.hidden : ""}`}>
      <div className={styles.wrapper}>
        <h4>{title}:</h4>

        {show && <p>{note}</p>}
      </div>
      <IconClickable SVGElement={show ? Utilities.hide : Utilities.notes} onClick={() => setShow(!show)} />
    </div>
  );
};

export default AssetNote;
