import { UploadingStatus } from "../../types/common/upload";
import { IGuestUploadFormInput } from "../../types/guest-upload/guest-upload";
import ContactForm from "./contact-form";
import styles from "./index.module.css";

interface GuestInfoFormProps {
  onSubmit: (data) => void;
  uploadingStatus: UploadingStatus;
  teamName: string;
  setUploadEnabled: (val: boolean) => void;
  setEdit: (val: boolean) => void;
  userDetails: IGuestUploadFormInput;
  setUserDetails: (data: IGuestUploadFormInput) => void;
}

const GuestInfoForm: React.FC<GuestInfoFormProps> = ({
  onSubmit,
  uploadingStatus,
  teamName,
  setUploadEnabled,
  setEdit,
  userDetails,
  setUserDetails,
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
        userDetails={userDetails}
        setUserDetails={setUserDetails}
      />
    </div>
  );
};

export default GuestInfoForm;
