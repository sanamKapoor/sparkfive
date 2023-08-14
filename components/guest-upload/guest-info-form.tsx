import { UploadingStatus } from "../../types/common/upload";
import Button from "../common/buttons/button";
import ContactForm from "./contact-form";
import styles from "./index.module.css";

interface GuestInfoFormProps {
  onSubmit: (data) => void;
  uploadingStatus: UploadingStatus;
  teamName: string;
  setUploadEnabled: (val: boolean) => void;
  setEdit: (val: boolean) => void;
}

const GuestInfoForm: React.FC<GuestInfoFormProps> = ({
  onSubmit,
  uploadingStatus,
  teamName,
  setUploadEnabled,
  setEdit,
}) => {
  return (
    <div className={styles.form}>
      <ContactForm
        id={"contact-form"}
        onSubmit={onSubmit}
        disabled={uploadingStatus === "uploading"}
        teamName={teamName}
      />
      <div className={styles.form_button}>
        <Button
          text="Save & Continue"
          className="container primary"
          onClick={() => {
            setUploadEnabled(true);
            setEdit(false);
          }}
        />
      </div>
    </div>
  );
};

export default GuestInfoForm;
