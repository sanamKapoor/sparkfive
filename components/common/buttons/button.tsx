import {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  MouseEventHandler,
} from "react";
import styles from "./button.module.css";

interface CommonButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  text: string;
  styleType?: string;
  styleTypes?: string[];
}

const Button: React.FC<CommonButtonProps> = ({
  text,
  type,
  onClick = (e) => {},
  disabled = false,
  styleType = "",
  styleTypes = [],
  className = "",
  form = null,
}) => {
  const props: any = {};
  if (form) {
    props.form = form;
  }
  return (
    <button
      className={`${styles.container} ${styles[styleType]} ${
        styles[type]
      } ${className} ${styleTypes
        .map((styleItem) => styles[styleItem])
        .join(" ")}`}
      type={type}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {text}
    </button>
  );
};

export default Button;
