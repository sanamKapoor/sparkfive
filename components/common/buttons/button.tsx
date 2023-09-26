import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import styles from "./button.module.css";

interface CommonButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  text: string;
}

const Button: React.FC<CommonButtonProps> = ({
  text,
  className = "",
  ...rest
}) => {
  const classes = className
    .split(" ")
    .map((style) => styles[style])
    .join(" ");

  return (
    <button className={classes} {...rest}>
      {text}
    </button>
  );
};

export default Button;
