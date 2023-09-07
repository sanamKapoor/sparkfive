import { useContext } from "react";
import { useForm } from "react-hook-form";
import { TeamContext } from "../../../../../context";
import styles from "./name-form.module.css";

// Components
import Button from "../../../../common/buttons/button";
import FormInput from "../../../../common/inputs/form-input";
import Input from "../../../../common/inputs/input";

const NameForm: React.FC = () => {
  const { team, patchTeam } = useContext(TeamContext);
  const { control, handleSubmit, errors } = useForm();

  const onSubmit = (fieldData) => {
    const { company } = fieldData;
    patchTeam({ company });
  };

  return (
    <>
    <div className={styles.compamnyInfo}>
    <h3>Company Info</h3>
    </div>
      <h3 className={styles.companyName}>Company Name</h3>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.container}>
        {team && (
          <div className={styles["form-container"]}>
           
              <FormInput
                InputComponent={<Input additionalClasses={styles.infoField} type="text" />}
                name="company"
                defaultValue={team.company}
                control={control}
                rules={{ minLength: 2, maxLength: 30, required: true }}
                errors={errors}
                message={
                  "This field should be between 2 and 30 characters long"
                }
              />
           
            <div>
              <Button
                text="Save Changes"
                type="submit"
                className="container submit input-height-primary save"
              />
            </div>
          </div>
        )}
      </form>
    </>
  );
};

export default NameForm;
