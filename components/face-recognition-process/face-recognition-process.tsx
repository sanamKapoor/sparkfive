import { useContext } from "react";

import { AssetContext } from "../../context";
import Base from "../common/modals/base";
import Spinner from "../common/spinners/spinner";

import styles from "./face-recognition-process.module.css";
import { Utilities } from "../../assets";

export default function FaceRecognitionProcess() {
  const { faceRecognitionScanning, setFaceRecognitionScanning } = useContext(AssetContext);

  return (
    <Base
      modalIsOpen={faceRecognitionScanning}
      overlayAdditionalClass={styles["overlay-modal"]}
      closeModal={() => {}}
      headText={""}
      subText={""}
    >
      <div className={styles.header}>
        <img
          src={Utilities.bigblueClose}
          alt="close"
          className={styles.close}
          onClick={() => {
            setFaceRecognitionScanning(false);
          }}
        />
      </div>
      <div className={styles.container}>
        <Spinner />

        <div className={styles.title}>Asset scanning in progress</div>
        <div className={styles["sub-title"]}>This may take some time, wait for the scan to complete</div>
      </div>
    </Base>
  );
}
