import styles from "./spinner-overlay.module.css";

// Components
import Spinner from "./spinner";

const SpinnerOverlay = ({ text }) => (
  <div className={styles.container}>
    {text && <p>{text}</p>}
    <Spinner />
  </div>
);

export default SpinnerOverlay;
