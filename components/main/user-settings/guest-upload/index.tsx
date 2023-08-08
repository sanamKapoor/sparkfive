import styles from "./index.module.css";

// Component
import Main from "../../../common/guest-upload";

const GuestUpload: React.FC = () => {
  return (
    <div className={styles.container}>
      <Main />
    </div>
  );
};

export default GuestUpload;
