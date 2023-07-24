import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import styles from "./auth-button.module.css";

interface AuthButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  text: string;
}

const AuthButton: React.FC<AuthButtonProps> = ({
  text,
  type,
  onClick = () => {},
  disabled = false,
}) => (
  <button
    className={styles.container}
    type={type}
    onClick={onClick}
    disabled={disabled}
  >
    {text}
  </button>
);

export default AuthButton;
