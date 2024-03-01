import ColorPicker from "./color-picker";

import styles from "./setting.module.css";

export default function Setting({ title = "", subTitle = "", value = "", onChange }: Props) {
  return (
    <div className={styles.wrapper}>
      <div>
        <div className={styles.title}>{title}</div>
        <div className={styles["sub-title"]}>{subTitle}</div>
      </div>

      <div className={styles["color-picker-container"]}>
        <ColorPicker value={value} onChange={onChange} />
      </div>
    </div>
  );
}

interface Props {
  value: string;
  title: string;
  subTitle: string;
  onChange: (value: string) => void;
}
