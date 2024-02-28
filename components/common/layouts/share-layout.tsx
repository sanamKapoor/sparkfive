import styles from "./share-layout.module.css";

const ShareLayout = ({ children }) => {
  return (
    <>
      {children}
      <footer className={styles.footer}></footer>
    </>
  );
};

export default ShareLayout;
