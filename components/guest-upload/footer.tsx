import Link from "next/link";
import styles from "./index.module.css";

const Footer = () => {
  return (
    <div className={`row justify-center ${styles["footer"]} ${styles["row"]}`}>
      <p className={"font-weight-600 m-b-0 font-14"}>Sparkfive</p>
      <p className={"m-b-0 font-16"}>
        Store, organize & distribute your digital assets efficiently with
        Sparkfive
      </p>
      <p className={"m-t-0 font-16"}>Unlease the power of your team</p>
      <p className={`${styles.footer_link} m-t-0 font-16`}>
        <Link href={"https://www.sparkfive.com"}>
          <a className={styles.link}>Learn More</a>
        </Link>
      </p>
    </div>
  );
};

export default Footer;
