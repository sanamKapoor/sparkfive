import styles from "./spinner-overlay.module.css";

// Components
import Spinner from "./spinner";

interface SpinnerOverlayProps {
  text?: string;
}

const SpinnerOverlay: React.FC<SpinnerOverlayProps> = ({ text }) => (
  <div className={styles.container}>
    {text && <p>{text}</p>}
    <Spinner />
  </div>
);

export default SpinnerOverlay;
