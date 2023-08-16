import { useForm } from "react-hook-form";
import styles from "./contact-form.module.css";

// Components
import Button from "../common/buttons/button";
import FormInput from "../common/inputs/form-input";
import Input from "../common/inputs/input";
import TextArea from "../common/inputs/text-area";

interface ContactFormProps {
  id: string;
  onSubmit: (data: any) => void;
  disabled: boolean;
  teamName: string;
  setUploadEnabled: (state: boolean) => void;
  setEdit: (state: boolean) => void;
}

const ContactForm: React.FC<ContactFormProps> = ({
  id,
  onSubmit,
  disabled = false,
  teamName = "",
  setUploadEnabled,
  setEdit,
}) => {
  const { control, handleSubmit, errors, getValues } = useForm();

  const submitForm = (data) => {
    console.log("form data: ", data);
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
                labId="firstName"
                label="First Name"
                InputComponent={
                  <Input
                    type="text"
                    id="firstName"
                    disabled={disabled}
                    additionalClasses={styles.input}
                  />
                }
                name="firstName"
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
                labId="lastName"
                label="Last Name"
                InputComponent={
                  <Input
                    type="text"
                    id="lastName"
                    disabled={disabled}
                    additionalClasses={styles.input}
                  />
                }
                name="lastName"
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
              labId="message"
              label={`Message to ${teamName} (i.e name of project, campaign, etc)`}
              InputComponent={
                <TextArea
                  type="text"
                  id="message"
                  rows={5}
                  disabled={disabled}
                  additionalClasses={styles.input}
                />
              }
              defaultValue={""}
              name="message"
              control={control}
              rules={{ minLength: 4, maxLength: 300 }}
              errors={errors}
              message={"This field should be between 4 and 300 characters long"}
            />
          </div>
        </div>
      </>
      <div className={styles.form_button}>
        <Button
          type="submit"
          text="Save & Continue"
          className="container primary"
          onClick={() => {
            console.log("form should be submitted now...");
            handleSubmit(submitForm);
            setUploadEnabled(true);
            setEdit(false);
          }}
        />
      </div>
    </form>
  );
};

export default ContactForm;
