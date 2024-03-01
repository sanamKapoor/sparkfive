import styles from "./index.module.css";

// Component
import Main from "../../../common/theme-customization";

const ThemeCustomization: React.FC = () => {
  return (
    <div className={styles.container}>
      <Main />
    </div>
  );
};

export default ThemeCustomization;
