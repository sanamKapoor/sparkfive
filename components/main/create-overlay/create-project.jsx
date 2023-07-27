import { capitalCase } from "change-case";
import Router from "next/router";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { LoadingContext, ScheduleContext } from "../../../context";
import projectApi from "../../../server-api/project";
import toastUtils from "../../../utils/toast";
import styles from "./create-project.module.css";

// Components
import Button from "../../common/buttons/button";
import FormInput from "../../common/inputs/form-input";
import Input from "../../common/inputs/input";
import Select from "../../common/inputs/select";

import projectTypes from "../../../resources/data/project-types.json";

const CreateProject = ({ publishDate }) => {
  const { control, handleSubmit, errors } = useForm();
  const [submitError, setSubmitError] = useState("");
  const { setNewItem } = useContext(ScheduleContext);
  const [type, setType] = useState();

  const [projectNames, setProjectNames] = useState([]);

  const { setIsLoading } = useContext(LoadingContext);

  useEffect(() => {
    getProjectNames();
  }, []);

  const onSubmit = async (projectData) => {
    setIsLoading(true);
    if (projectNames.includes(projectData.name)) {
      return toastUtils.error("A project with that name already exists");
    }
    if (!type) {
      return toastUtils.error("The project mubst have a type");
    }
    try {
      const createData = {
        ...projectData,
        type: type.value,
      };
      if (publishDate) createData.publishDate = publishDate;
      const { data } = await projectApi.createProject(createData);

      // Only redirect if publish date is not present
      if (!publishDate) {
        Router.replace(`/main/projects/${data.id}`);
      } else {
        setNewItem({ item: data, type: "project" });
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

  const getProjectNames = async () => {
    try {
      const { data } = await projectApi.getProjects();
      setProjectNames(data.map((project) => project.name));
    } catch (err) {
      // TODO: Error handling
    }
  };

  return (
    <div className={`${styles.container}`}>
      <h2>Create New Project</h2>
      <form onSubmit={handleSubmit(onSubmit)} className={"create-overlay-form"}>
        <div className={styles["input-wrapper"]}>
          <FormInput
            InputComponent={
              <Input
                type="text"
                placeholder="Name Your Project"
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
        <div className={styles["button-select-wrapper"]}>
          <div className={styles.type}>
            <Select
              placeholder="Select Content Type..."
              options={projectTypes.map((type) => ({
                value: type,
                label: capitalCase(type),
              }))}
              onChange={(selected) => setType(selected)}
              value={type}
              styleType="regular"
            />
          </div>
          <Button type={"submit"} text={"Next"} styleType="primary" />
        </div>
      </form>
    </div>
  );
};

export default CreateProject;
