import styles from "./breadcrumbs.module.css";

const Breadcrumbs = ({ links, current }) => {
  return (
    <div className={styles.container}>
      {links.map((link) => (
        <div className={styles.link} onClick={link.action}>
          {link.name}
        </div>
      ))}
      <div className={styles.current}>/ {current}</div>
    </div>
  );
};

export default Breadcrumbs;
