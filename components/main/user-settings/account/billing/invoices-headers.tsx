import styles from "./invoices.module.css";

const Headers = ({ type = "invoice" }) => (
  <li className={styles.headers}>
    <div>Date</div>
    <div>Plan</div>
    {type === "invoice" && <div>Status</div>}
    <div>Amount</div>
    {type === "invoice" && <div>Download</div>}
  </li>
);

export default Headers;
