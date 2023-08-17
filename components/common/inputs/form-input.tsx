import { Controller, ErrorMessage, EventFunction } from "react-hook-form";

import styles from "./form-input.module.css";

interface FormInputProps {
  label?: string;
  labelClass?: string;
  labId?: string;
  name: string;
  control?: any;
  rules?: Record<string, unknown>;
  InputComponent: Element;
  errors?: unknown;
  message?: string;
  defaultValue?: string;
  onChange: EventFunction;
  valueName: string;
}

const FormInput: React.FC<FormInputProps> = ({
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
  onChange,
  valueName,
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
        valueName={valueName}
        defaultValue={defaultValue}
        onChange={onChange}
      />
      <p className={styles.error}>
        <ErrorMessage errors={errors} name={name} message={message} />
      </p>
    </>
  );
};

export default FormInput;
