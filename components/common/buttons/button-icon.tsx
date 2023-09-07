import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import styles from "./button-icon.module.css";

interface ButtonIconProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  text: string;
  icon: string;
  isGray?: boolean;
  additionalClass?: string;
}

const ButtonIcon: React.FC<ButtonIconProps> = ({
  text,
  disabled = false,
  icon,
  onClick,
  isGray = false,
  additionalClass = '',
}) => {
  return (
    <button
      className={`${!isGray ? styles.container : styles["container-gray"]} ${additionalClass}`}
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

export default ButtonIcon;
