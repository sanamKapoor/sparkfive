import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { TeamContext } from "../../../../../context";
import styles from "./name-form.module.css";

// Components
import Button from "../../../../common/buttons/button";
import FormInput from "../../../../common/inputs/form-input";
import Input from "../../../../common/inputs/input";
import { pages } from "../../../../../constants/analytics";
import useAnalytics from "../../../../../hooks/useAnalytics";

const NameForm: React.FC = () => {
  const { team, patchTeam } = useContext(TeamContext);
  const { control, handleSubmit, errors } = useForm();

  const { pageVisit } = useAnalytics();

  useEffect(() => {    
    pageVisit(pages.COMPANY)
  },[]);

  const onSubmit = (fieldData) => {
    const { company } = fieldData;
    patchTeam({ company });
  };

  return (
    <div className={styles.companyAllInfo}>
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
    </div>
  );
};

export default NameForm;
