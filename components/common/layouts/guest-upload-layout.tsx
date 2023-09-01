import { GeneralImg } from "../../../assets";
import styles from "./guest-upload-layout.module.css";

import AssetContextProvider from "../../../context/asset-provider";
import Footer from "../../guest-upload/footer";

interface GuestUploadLayoutProps {
  children?: React.ReactNode;
  logo: string;
  banner: string;
}
const GuestUploadLayout: React.FC<GuestUploadLayoutProps> = ({
  children,
  logo,
  banner,
}) => {
  return (
    <>
      <AssetContextProvider>
        <header className={styles.header}>
          <img
            className={`${styles["logo-img"]} ${styles["left-logo"]}`}
            src={logo}
          />
          <div className={styles["right-logo"]}>
            <span>Powered by Sparkfive</span>
            <img className={styles["logo-img"]} src={GeneralImg.logo} />
          </div>
        </header>
        <div className={styles.banner}>
          <img src={banner} alt="cover" />
        </div>
        {children}
        <Footer />
      </AssetContextProvider>
    </>
  );
};

export default GuestUploadLayout;
