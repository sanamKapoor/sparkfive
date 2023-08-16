import { UploadingStatus } from "../../types/common/upload";
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
        setEdit={setEdit}
        setUploadEnabled={setUploadEnabled}
      />
    </div>
  );
};

export default GuestInfoForm;
