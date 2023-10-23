import ColorPicker from "./color-picker";

import styles from "./logotype.module.css";

import { GeneralImg, Utilities } from "../../../assets";

import LogoPicker from "./logo-picker";
import { useState } from "react";

export default function Logotype({ currentLogo, onChange }: Props) {
  return (
    <div className={styles.wrapper}>
      <div>
        <img className={styles["logo-img"]} src={currentLogo.url} alt={"logo"} />
      </div>
      <div>
        <LogoPicker onChange={onChange} />
        <div className={styles["description-text"]}>
          Your logo appears in your shared collections and portals. Recommended: Max file size of 1024x1024 pixels with
          a transparent background (SVG, JPG, PNG).
        </div>
      </div>
    </div>
  );
}

interface Props {
  currentLogo: any;
  onChange: (value: any) => void;
}
