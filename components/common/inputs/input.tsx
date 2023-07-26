import { DetailedHTMLProps, InputHTMLAttributes } from "react";
import styles from "./input.module.css";

interface CommonInputProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  styleType?: string;
  additionalClasses?: string;
}

const Input: React.FC<CommonInputProps> = (props) => {
  const { styleType, additionalClasses, ...rest } = props;

  return (
    <input
      {...rest}
      className={`${styles.container} ${
        styleType && styles[styleType]
      } ${additionalClasses}`}
    />
  );
};

export default Input;
