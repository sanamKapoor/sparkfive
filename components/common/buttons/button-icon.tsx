import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import styles from "./button-icon.module.css";

import { getSecondaryColor } from "../../../utils/theme";

interface ButtonIconProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  text: string;
  icon?: string;
  isGray?: boolean;
  additionalClass?: string;
  SVGElement?: any;
}

const ButtonIcon: React.FC<ButtonIconProps> = ({
  text,
  disabled = false,
  icon,
  onClick,
  isGray = false,
  additionalClass = "",
  SVGElement,
}) => {
  return (
    <button
      className={`${!isGray ? styles.container : styles["container-gray"]} ${additionalClass}`}
      disabled={disabled}
      onClick={onClick}
    >
      <span className={styles.icon}>
        {!SVGElement && <img src={icon} alt={"icon"} />}
        {SVGElement && <SVGElement />}
      </span>
      <span className={styles.text}>{text}</span>
    </button>
  );
};

export default ButtonIcon;
