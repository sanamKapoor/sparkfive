import { useContext } from "react";

import { AppImg, GeneralImg } from "../../../assets";
import styles from "./guest-upload-layout.module.css";

import { GuestUploadContext } from "../../../context";
import AssetContextProvider from "../../../context/asset-provider";
import Footer from "../../guest-upload/footer";

const GuestUploadLayout = ({ children }) => {
  const { logo } = useContext(GuestUploadContext);

  return (
    <>
      <AssetContextProvider>
        <header className={styles.header}>
          <img
            className={`${styles["logo-img"]} ${styles["left-logo"]}`}
            src={logo ? logo : GeneralImg.logo}
          />
          <div className={styles["right-logo"]}>
            <span>Powered by Sparkfive</span>
            <img className={styles["logo-img"]} src={GeneralImg.logo} />
          </div>
        </header>
        <div className={styles.cover}>
          <img src={AppImg.guestCover} alt="cover" />
        </div>
        {children}
        <Footer />
      </AssetContextProvider>
    </>
  );
};

export default GuestUploadLayout;
