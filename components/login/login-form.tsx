import Link from "next/link";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import jwt_decode from 'jwt-decode';
import { LoadingContext, UserContext } from "../../context";
import userApi from "../../server-api/user";
import styles from "./login-form.module.css";

// Components
import Button from "../common/buttons/button";
import FormInput from "../common/inputs/form-input";
import Input from "../common/inputs/input";
import useAnalytics from '../../hooks/useAnalytics'

const Form = ({ teamId }) => {
  const { control, handleSubmit, errors } = useForm();
  const [submitError, setSubmitError] = useState("");
  const { afterAuth } = useContext(UserContext);
  const { setIsLoading } = useContext(LoadingContext);
  const {identify}  = useAnalytics();

  const onSubmit = async (loginData) => {
    try {
      setIsLoading(true);
      const signInData = {
        email: loginData.email,
        password: loginData.password,
      };
      const { data } = await userApi.signIn(signInData, teamId);      
      await afterAuth(data);

      const decoded = jwt_decode(data.token);

      identify(decoded.id, {
        email: loginData.email,
      });
    } catch (err) {
      // TODO: Show error message
      if (err.response?.data?.message) {
        setSubmitError(err.response.data.message);
      } else {
        setSubmitError("Something went wrong, please try again later");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.container}>
      <div>
        <FormInput
          InputComponent={<Input type="text" placeholder="Email Address" />}
          name="email"
          control={control}
          rules={{
            required: true,
            pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,15}$/i,
          }}
          message={"Invalid email address"}
          errors={errors}
        />
      </div>
      <FormInput
        InputComponent={<Input type="password" placeholder="Password" />}
        name="password"
        control={control}
        message={"This field should be minimun 8 characters long"}
        rules={{ minLength: 8, maxLength: 80, required: true }}
        errors={errors}
      />
      <div className={styles.forgot}>
        <Link href="/forgot-password">
          <span>Forgot Your password?</span>
        </Link>
      </div>
      {submitError && <p className="submit-error">{submitError}</p>}
      <div className={styles["button-wrapper"]}>
        <Button className="auth-container" type={"submit"} text={"Log In"} />
      </div>
    </form>
  );
};

export default Form;
