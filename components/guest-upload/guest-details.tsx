import React from "react";
import { IGuestUploadFormInput } from "../../types/guest-upload/guest-upload";
import styles from "./index.module.css";

interface GuestDetailsProps {
  userDetails: IGuestUploadFormInput;
  setEdit?: (val: boolean) => void;
}

const GuestDetails: React.FC<GuestDetailsProps> = ({
  userDetails,
  setEdit,
}) => {
  return (
    <div className={styles.guest_info}>
      <div className={styles.guest_info_row}>
        <div className={styles.user}>
          {userDetails.firstName} {userDetails.lastName}
        </div>
        <div className={styles.edit} onClick={() => setEdit(true)}>
          Edit
        </div>
      </div>
      <div className={styles.email}>{userDetails.email}</div>
      <div className={styles.message}>{userDetails.message}</div>
    </div>
  );
};

export default GuestDetails;
