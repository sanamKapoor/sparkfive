import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { LoadingContext, UserContext } from "../../context";
import userApi from "../../server-api/user";
import styles from "./signup-form.module.css";

// Components
import FormInput from "../common/inputs/form-input";
import Input from "../common/inputs/input";
import Select from "../common/inputs/select";

import companySizeOptions from "../../resources/data/company-sizes.json";
import Button from "../common/buttons/button";

const SignupForm = ({
  inviteCode = "",
  priceData,
  email,
  onlyWorkEmail = false,
}) => {
  const { control, handleSubmit, errors, getValues, setValue } = useForm();
  const [companySize, setCompanySize] = useState(undefined);
  const [submitError, setSubmitError] = useState("");
  const { afterAuth } = useContext(UserContext);
  const { setIsLoading } = useContext(LoadingContext);
  const onSubmit = async (fieldData) => {
    try {
      setIsLoading(true);
      const createData = {
        email: fieldData.email,
        name: fieldData.name,
        company: fieldData.company,
        phone: fieldData.phone,
        password: fieldData.password,
        companySize: companySize ? companySize.value : "",
      };
      const { data } = await userApi.signUp(createData, {
        inviteCode,
        priceId: priceData?.priceId,
      });
      await afterAuth(data);
    } catch (err) {
      if (err.response?.data?.message) {
        setSubmitError(err.response.data.message);
      } else {
        setSubmitError("Something went wrong, please try again later");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setValue("email", email);
  }, [email]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.container}>
      <div>
        <FormInput
          InputComponent={<Input type="text" placeholder="Full Name" />}
          name="name"
          control={control}
          rules={{ minLength: 4, maxLength: 30, required: true }}
          errors={errors}
          message={"This field should be between 4 and 30 characters long"}
        />
      </div>
      <div>
        <FormInput
          InputComponent={
            <Input type="text" placeholder="Work Email Address" />
          }
          name="email"
          control={control}
          rules={{
            required: true,
            pattern: onlyWorkEmail
              ? /^([\w-\.]+@(?!gmail.com)(?!yahoo.com)(?!hotmail.com)(?!yahoo.co.in)(?!aol.com)(?!abc.com)(?!xyz.com)(?!pqr.com)(?!rediffmail.com)(?!live.com)(?!outlook.com)(?!me.com)(?!msn.com)(?!ymail.com)([\w-]+\.)+[\w-]{2,4})?$/i
              : /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,15}$/i,
          }}
          message={
            onlyWorkEmail
              ? "Please enter your work email address"
              : "Invalid email address"
          }
          errors={errors}
        />
      </div>
      <div>
        <FormInput
          InputComponent={<Input type="text" placeholder="Phone Number" />}
          name="phone"
          control={control}
          rules={{ required: true, pattern: /\d/i, maxLength: 20 }}
          message={"Invalid phone number"}
          errors={errors}
        />
      </div>
      {!inviteCode && (
        <div>
          <FormInput
            InputComponent={<Input type="text" placeholder="Company Name" />}
            name="company"
            control={control}
            rules={{ minLength: 2, maxLength: 40, required: true }}
            message={"This field should be between 2 and 40 characters long"}
            errors={errors}
          />
        </div>
      )}
      {!inviteCode && (
        <div>
          <Select
            placeholder="Company Size..."
            options={companySizeOptions}
            onChange={(selected) => setCompanySize(selected)}
            value={companySize}
          />
        </div>
      )}
      <div>
        <FormInput
          InputComponent={<Input type="password" placeholder="Password" />}
          name="password"
          control={control}
          message={"This field should be minimun 8 characters long"}
          rules={{ minLength: 8, maxLength: 80, required: true }}
          errors={errors}
        />
      </div>
      <div>
        <FormInput
          InputComponent={
            <Input type="password" placeholder="Confirm Password" />
          }
          name="passwordConfirm"
          control={control}
          rules={{ validate: (value) => value === getValues().password }}
          message={"Passwords must match"}
          errors={errors}
        />
      </div>
      {submitError && <p className="submit-error">{submitError}</p>}
      {priceData && (
        <p className={styles["plan-desc"]}>
          You will be subscribed to the trial of{" "}
          <span>{priceData.product}</span> on signup
        </p>
      )}
      <div className={styles["button-wrapper"]}>
        <Button className="auth-container" type={"submit"} text={"Sign Up"} />
      </div>
    </form>
  );
};

export default SignupForm;
