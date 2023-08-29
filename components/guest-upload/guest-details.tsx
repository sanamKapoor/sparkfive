import React from "react";
import { IGuestUserInfo } from "../../types/guest-upload/guest-upload";
import styles from "./index.module.css";

interface GuestDetailsProps {
  userDetails: IGuestUserInfo;
  onCancel: () => void;
}

const GuestDetails: React.FC<GuestDetailsProps> = ({
  userDetails,
  onCancel,
}) => {
  return (
    <div className={styles.guest_info}>
      <div className={styles.guest_info_row}>
        <div className={styles.user}>
          {userDetails.firstName} {userDetails.lastName}
        </div>
        <div className={styles.edit} onClick={onCancel}>
          Cancel
        </div>
      </div>
      <div className={styles.email}>{userDetails.email}</div>
      <div className={styles.message}>{userDetails.notes}</div>
    </div>
  );
};

export default GuestDetails;
