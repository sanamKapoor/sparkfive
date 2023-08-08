import { useForm } from "react-hook-form";
import styles from "./request-form.module.css";

// Components
import { IRequestFormData } from "../../../../types/team/team";
import Button from "../../../common/buttons/button";
import FormInput from "../../../common/inputs/form-input";
import Input from "../../../common/inputs/input";
import TextArea from "../../../common/inputs/text-area";

interface RequestFormProps {
  data: IRequestFormData;
  onApprove: () => void;
  onReject: () => void;
}

const RequestForm: React.FC<RequestFormProps> = ({
  data: { id, email, name, phone, city, state, message },
  onApprove,
  onReject,
}) => {
  const { control, handleSubmit, errors } = useForm();

  return (
    <form onSubmit={handleSubmit(() => {})}>
      {email && (
        <>
          <h4 className={styles.title}>Review Access Request</h4>
          <div className={styles.container}>
            <div className={styles.form}>
              <div className={styles["fields-pair"]}>
                <div className={styles.city}>
                  <FormInput
                    labId="name"
                    labelClass={styles.label}
                    label="Full Name"
                    InputComponent={
                      <Input type="text" id="name" disabled={true} />
                    }
                    name="name"
                    defaultValue={name}
                    control={control}
                    rules={{ minLength: 2, maxLength: 30 }}
                    errors={errors}
                    message={
                      "This field should be between 2 and 30 characters long"
                    }
                  />
                </div>
                <div className={styles.zip}>
                  <FormInput
                    labelClass={styles.label}
                    labId="city"
                    label="City"
                    InputComponent={
                      <Input type="text" id="city" disabled={true} />
                    }
                    name="city"
                    defaultValue={city}
                    control={control}
                    rules={{ required: true }}
                    errors={errors}
                    message={"This field is required"}
                  />
                </div>
              </div>
              <div className={styles["fields-pair"]}>
                <div className={styles.city}>
                  <FormInput
                    labelClass={styles.label}
                    labId="email"
                    label="Email Address"
                    InputComponent={
                      <Input type="text" id="email" disabled={true} />
                    }
                    name="email"
                    defaultValue={email}
                    control={control}
                    rules={{
                      required: true,
                      pattern:
                        /^([\w-\.]+@(?!gmail.com)(?!yahoo.com)(?!hotmail.com)(?!yahoo.co.in)(?!aol.com)(?!abc.com)(?!xyz.com)(?!pqr.com)(?!rediffmail.com)(?!live.com)(?!outlook.com)(?!me.com)(?!msn.com)(?!ymail.com)([\w-]+\.)+[\w-]{2,4})?$/i,
                    }}
                    message={`Please enter your work email address`}
                    errors={errors}
                  />
                </div>
                <div className={styles.zip}>
                  <FormInput
                    labelClass={styles.label}
                    labId="state"
                    label="State"
                    InputComponent={
                      <Input type="text" id="state" disabled={true} />
                    }
                    name="state"
                    defaultValue={state}
                    control={control}
                    rules={{ required: true }}
                    errors={errors}
                    message={"This field is required"}
                  />
                </div>
              </div>
              <div className={styles["fields-pair"]}>
                <div className={styles.city}>
                  <FormInput
                    labId="phone"
                    labelClass={styles.label}
                    label="Phone Number"
                    InputComponent={
                      <Input type="text" id="phone" disabled={true} />
                    }
                    name="phone"
                    defaultValue={phone}
                    control={control}
                    rules={{ required: true }}
                    errors={errors}
                    message={"This field is required"}
                  />
                </div>
                <div className={styles.zip}></div>
              </div>

              <FormInput
                labId="message"
                label="Message"
                labelClass={styles.label}
                InputComponent={
                  <TextArea
                    type="text"
                    id="message"
                    disabled={true}
                    rows={5}
                    placeholder={"How will you use these digital assets?"}
                  />
                }
                defaultValue={message}
                name="message"
                control={control}
                rules={{ required: true }}
                errors={errors}
                message={
                  "This field should be between 4 and 300 characters long"
                }
              />
            </div>
          </div>

          <div className={styles["button-list"]}>
            <Button
              className={`${styles.button} container exclude-min-height primary`}
              type={"button"}
              text="Approve"
              onClick={onApprove}
            />
            <Button
              className={`${styles.button} container exclude-min-height secondary`}
              text={"Reject"}
              type={"button"}
              onClick={onReject}
            />
          </div>
        </>
      )}
    </form>
  );
};

export default RequestForm;
