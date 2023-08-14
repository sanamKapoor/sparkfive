import React from "react";
import styles from "./index.module.css";

interface GuestDetailsProps {
  setEdit?: (val: boolean) => void;
}

const GuestDetails: React.FC<GuestDetailsProps> = ({ setEdit }) => {
  return (
    <div className={styles.guest_info}>
      <div className={styles.guest_info_row}>
        <div className={styles.user}>John Smith</div>
        <div className={styles.edit} onClick={() => setEdit(true)}>
          Edit
        </div>
      </div>
      <div className={styles.email}>testJohn@gmail.com</div>
      <div className={styles.message}>
        This is my message to the ChampionX team. Please let me know if you get
        this. I will be standing by waiting for your response. These file are
        submitted by me and me only
      </div>
    </div>
  );
};

export default GuestDetails;
