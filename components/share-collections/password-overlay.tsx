import { useState } from "react";
import { GeneralImg } from "../../assets";
import styles from "./password-overlay.module.css";

// Components
import Button from "../common/buttons/button";
import AuthContainer from "../common/containers/auth-container";
import Input from "../common/inputs/input";

const CreateOverlay = ({ onPasswordSubmit, logo, fields = ["password"] }) => {
  const [shareEmail, setShareEmail] = useState("");
  const [sharePassword, setSharePassword] = useState("");

  const submitPassword = (e) => {
    e.preventDefault();
    onPasswordSubmit(sharePassword, shareEmail);
  };

  return (
    <div className={`app-overlay ${styles.container}`}>
      <div className={`${styles.container} container-centered`}>
        <img src={logo || GeneralImg.logoHorizontal} className={styles.logo} />
        <AuthContainer
          title="Welcome!"
          additionalClass={"color-secondary"}
          subtitle={"Enter password to proceed"}
        >
          <form onSubmit={submitPassword} className={styles["password-form"]}>
            {fields.includes("email") && (
              <Input
                additionalClasses={"m-b-15"}
                placeholder={"Email"}
                onChange={(e) => setShareEmail(e.target.value)}
                styleType={"regular-short"}
                type="email"
              />
            )}

            {fields.includes("password") && (
              <Input
                placeholder={"Password"}
                onChange={(e) => setSharePassword(e.target.value)}
                styleType={"regular-short"}
                type="password"
              />
            )}

            <Button
              className="auth-container"
              text={"Submit"}
              type={"submit"}
            />
          </form>
        </AuthContainer>
      </div>
    </div>
  );
};

export default CreateOverlay;
