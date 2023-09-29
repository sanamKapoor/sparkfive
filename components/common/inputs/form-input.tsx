import { Controller, ErrorMessage } from "react-hook-form";

import styles from "./form-input.module.css";

const FormInput = ({
  label = "",
  labelClass = "",
  labId = "",
  name,
  control,
  rules,
  InputComponent,
  errors,
  message = "",
  defaultValue = "",
}) => {
  return (
    <>
      {label && (
        <label className={labelClass} htmlFor={labId}>
          {label}
        </label>
      )}
      <Controller
        as={InputComponent}
        name={name}
        control={control}
        rules={rules}
        defaultValue={defaultValue}
      />
      <p className={styles.error}>
        <ErrorMessage errors={errors} name={name} message={message} />
      </p>
    </>
  );
};

export default FormInput;
