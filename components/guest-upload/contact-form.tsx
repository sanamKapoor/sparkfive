import styles from "./contact-form.module.css";
import { useState } from "react";
import { useForm } from "react-hook-form";

// Components
import FormInput from "../common/inputs/form-input";
import Input from "../common/inputs/input";
import TextArea from "../common/inputs/text-area";

interface ContactFormProps {
  id: string;
  onSubmit: (data: any) => void;
  disabled: boolean;
  teamName: string;
}

const ContactForm: React.FC<ContactFormProps> = ({
  id,
  onSubmit,
  disabled = false,
  teamName = "",
}) => {
  const { control, handleSubmit, errors } = useForm();

  const submitForm = (data) => {
    onSubmit(data);
  };

  return (
    <form
      id={id}
      onSubmit={handleSubmit(submitForm)}
      className={styles["form"]}
    >
      <>
        <div className={styles.container}>
          <div className={styles.row}>
            <div>
              <FormInput
                labId="first_name"
                label="First Name"
                InputComponent={
                  <Input
                    type="text"
                    id="first_name"
                    disabled={disabled}
                    additionalClasses={styles.input}
                  />
                }
                name="first_name"
                defaultValue={""}
                control={control}
                rules={{ required: true, minLength: 2, maxLength: 30 }}
                errors={errors}
                message={
                  "This field should be between 2 and 30 characters long"
                }
              />
            </div>
            <div>
              <FormInput
                labId="last_name"
                label="Last Name"
                InputComponent={
                  <Input
                    type="text"
                    id="last_name"
                    disabled={disabled}
                    additionalClasses={styles.input}
                  />
                }
                name="last_name"
                defaultValue={""}
                control={control}
                rules={{ required: true, minLength: 2, maxLength: 30 }}
                errors={errors}
                message={
                  "This field should be between 2 and 30 characters long"
                }
              />
            </div>
          </div>
          <div className={styles.row}>
            <div>
              <FormInput
                labId="email"
                label="Email"
                InputComponent={
                  <Input
                    type="text"
                    id="email"
                    disabled={disabled}
                    additionalClasses={styles.input}
                  />
                }
                name="email"
                defaultValue={""}
                control={control}
                rules={{
                  required: true,
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Wrong email format",
                  },
                }}
                errors={errors}
                message={"Wrong email format"}
              />
            </div>
          </div>

          <div>
            <FormInput
              labId="notes"
              label={`Message to ${teamName} (i.e name of project, campaign, etc)`}
              InputComponent={
                <TextArea
                  type="text"
                  id="notes"
                  rows={5}
                  disabled={disabled}
                  additionalClasses={styles.input}
                />
              }
              defaultValue={""}
              name="notes"
              control={control}
              rules={{ minLength: 4, maxLength: 300 }}
              errors={errors}
              message={"This field should be between 4 and 300 characters long"}
            />
          </div>
        </div>
      </>
    </form>
  );
};

export default ContactForm;
