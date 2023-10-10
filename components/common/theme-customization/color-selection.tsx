import ColorPanel from "./color-panel";

import styles from "./color-picker.module.css";

import { Utilities } from "../../../assets";
import { useState } from "react";

export default function ColorSelection({ defaultColor = "#ffffff", onSelect, onCancel }: Props) {
  const [color, setColor] = useState(defaultColor);
  return (
    <div className={styles["dropdown-wrapper"]}>
      <div className={styles["header"]}>
        <div className={styles["title"]}>Primary Color</div>

        <img src={Utilities.grayClose} alt={"close"} onClick={onCancel} />
      </div>

      <ColorPanel
        currentValue={color}
        onSelect={(value) => {
          setColor(value);
        }}
      />

      <div className={styles["button-row"]}>
        <button className={styles["cancel-btn"]} onClick={onCancel}>
          Cancel
        </button>
        <button
          className={styles["save-btn"]}
          onClick={() => {
            onSelect(color);
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
}

interface Props {
  defaultColor?: string;
  onSelect: (value: string) => void;
  onCancel: () => void;
}
