import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import styles from "./disable-btn.module.css";

interface ButtonIconProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  text: string;
  icon: string;
  isGray?: boolean;
}

const DisableBtn: React.FC<ButtonIconProps> = ({
  text,
  disabled = false,
  icon,
  onClick,
  isGray = false,
}) => {
  return (
    <button
      className={`${!isGray ? styles.container : styles["container-gray"]}`}
      disabled={disabled}
      onClick={onClick}
    >
      <span className={styles.icon}>
        <img src={icon} />
      </span>
      <span className={styles.text}>{text}</span>
    </button>
  );
};

export default DisableBtn;
