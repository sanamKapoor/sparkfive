import Router from "next/router";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { LoadingContext, ScheduleContext } from "../../../context";
import taskApi from "../../../server-api/task";
import toastUtils from "../../../utils/toast";
import styles from "./create-task.module.css";

// Components
import Button from "../../common/buttons/button";
import FormInput from "../../common/inputs/form-input";
import Input from "../../common/inputs/input";

const CreateTask = ({ endDate }) => {
  const { control, handleSubmit, errors } = useForm();
  const [submitError, setSubmitError] = useState("");
  const { setNewItem } = useContext(ScheduleContext);
  const [taskNames, setTaskNames] = useState([]);

  useEffect(() => {
    getTaskNames();
  }, []);

  const { setIsLoading } = useContext(LoadingContext);

  const onSubmit = async (taskData) => {
    setIsLoading(true);
    const createData = { ...taskData };
    if (taskNames.includes(taskData.name)) {
      return toastUtils.error("A task with that name already exists");
    }
    try {
      if (endDate) createData.endDate = endDate;
      const { data } = await taskApi.createTask({ taskData: createData });

      // Only redirect if publish date is not present
      if (!endDate) {
        Router.replace(`/main/tasks/${data.id}`);
      } else {
        setNewItem({ item: data, type: "task" });
      }
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

  const getTaskNames = async () => {
    try {
      const { data } = await taskApi.getTasks();
      setTaskNames(data.map((task) => task.name));
    } catch (err) {
      // TODO: Error handling
    }
  };

  return (
    <div className={`${styles.container}`}>
      <h2>Create New Task</h2>
      <form onSubmit={handleSubmit(onSubmit)} className={"create-overlay-form"}>
        <div className={styles["input-wrapper"]}>
          <FormInput
            InputComponent={
              <Input
                type="text"
                placeholder="Name Your Task"
                styleType="regular"
              />
            }
            name="name"
            control={control}
            message={"This field should be between 1 and 30 characters long"}
            rules={{ minLength: 1, maxLength: 30, required: true }}
            errors={errors}
          />
        </div>
        <div className={styles["button-wrapper"]}>
          <Button type={"submit"} text={"Next"} styleType="primary" />
        </div>
      </form>
    </div>
  );
};

export default CreateTask;
