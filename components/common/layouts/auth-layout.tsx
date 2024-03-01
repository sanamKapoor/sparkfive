import Link from "next/link";
import { useContext } from "react";
import { GeneralImg } from "../../../assets";
import { LoadingContext, UserContext } from "../../../context";
import styles from "./auth-layout.module.css";

// Components
import SpinnerOverlay from "../spinners/spinner-overlay";

const AuthLayout = ({ children }) => {
  const { isLoading } = useContext(LoadingContext);
  const { vanityCompanyInfo } = useContext(UserContext);

  return (
    <>
      <header className={styles.header}>
        {!vanityCompanyInfo && (
          <Link href="/main/overview">
            <a>
              <img
                className={styles["logo-img"]}
                src={GeneralImg.logoHorizontal}
              />
            </a>
          </Link>
        )}
      </header>
      {isLoading && <SpinnerOverlay />}
      {children}
      <footer className={styles.footer}></footer>
    </>
  );
};

export default AuthLayout;
