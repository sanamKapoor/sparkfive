import styles from "./spinner.module.css";

export default ({ className = "" }) => (
  <div className={`${styles["lds-ring"]} ${className}`}>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
);
