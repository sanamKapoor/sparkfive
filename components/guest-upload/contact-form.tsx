import { useForm } from "react-hook-form";
import styles from "./contact-form.module.css";

// Components
import { IGuestUserInfo } from "../../types/guest-upload/guest-upload";
import Button from "../common/buttons/button";
import FormInput from "../common/inputs/form-input";
import Input from "../common/inputs/input";
import TextArea from "../common/inputs/text-area";

interface ContactFormProps {
  data: IGuestUserInfo;
  onSubmit: (data: IGuestUserInfo) => void;
  teamName: string;
}

const ContactForm: React.FC<ContactFormProps> = ({
  data,
  onSubmit,
  teamName = "",
}) => {
  const { control, handleSubmit, errors } = useForm({
    defaultValues: data,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles["form"]}>
      <>
        <div className={styles.container}>
          <div>
            <div className={styles["fields-pair"]}>
              <div className={styles.city}>
                <FormInput
                  labId="name"
                  label="Your Name"
                  InputComponent={
                    <Input
                      type="text"
                      id="name"
                      additionalClasses={styles.input}
                    />
                  }
                  name="name"
                  defaultValue={""}
                  control={control}
                  rules={{ required: true, minLength: 2, maxLength: 30 }}
                  errors={errors}
                  message={
                    "This field should be between 2 and 30 characters long"
                  }
                />
              </div>
              <div className={styles.city}>
                <FormInput
                  labId="email"
                  label="Email Address"
                  InputComponent={
                    <Input
                      type="text"
                      id="email"
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

            <FormInput
              labId="notes"
              label={`Note to ${teamName} (i.e name of project, campaign, etc)`}
              InputComponent={
                <TextArea
                  type="text"
                  id="notes"
                  rows={5}
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
      <Button
        type="submit"
        className="container primary"
        text="Save & Continue"
      />
    </form>
  );
};

export default ContactForm;
