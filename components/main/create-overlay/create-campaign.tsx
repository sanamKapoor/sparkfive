import update from "immutability-helper";
import Router from "next/router";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  LoadingContext,
  ScheduleContext,
  TeamContext,
  UserContext,
} from "../../../context";
import channelSocialOptions from "../../../resources/data/channels-social.json";
import campaignApi from "../../../server-api/campaign";
import projectApi from "../../../server-api/project";
import toastUtils from "../../../utils/toast";
import styles from "./create-campaign.module.css";

// Components
import Button from "../../common/buttons/button";
import FormInput from "../../common/inputs/form-input";
import Input from "../../common/inputs/input";
import CreateCampaignProjects from "./create-campaign-projects";

const EMPTY_CHANNEL = "Select Channel";

const CreateCampaign = () => {
  const { user } = useContext(UserContext);

  const { getTeamMembers } = useContext(TeamContext);

  const { control, handleSubmit, errors } = useForm();
  const { setNeedItemReset } = useContext(ScheduleContext);
  const { isLoading, setIsLoading } = useContext(LoadingContext);
  const [submitError, setSubmitError] = useState("");

  const [campaignNames, setCampaignNames] = useState([]);
  const [projectNames, setProjectNames] = useState([]);

  // New editable fields
  const DEFAULT_PROJECT_FIELDS = {
    channel: EMPTY_CHANNEL,
    name: "",
    publishDate: null,
    collaborators: [],
    status: "draft",
  };

  // Array projects
  const [projects, setProjects] = useState([
    {
      ...DEFAULT_PROJECT_FIELDS,
    },
  ]);

  useEffect(() => {
    getTeamMembers();
  }, []);

  const addProject = (e) => {
    e.preventDefault();
    setProjects([...projects, { ...DEFAULT_PROJECT_FIELDS }]);
  };

  const removeProject = (e, index) => {
    e.preventDefault();
    setProjects(
      update(projects, {
        $splice: [[index, 1]],
      })
    );
  };

  const addCollaborator = (index, user) => {
    // Only add if collaborator is not on list
    if (projects[index].collaborators.find(({ id }) => id === user.id)) {
      return removeCollaborator(index, user);
    }
    setProjects(
      update(projects, {
        [index]: {
          collaborators: {
            $push: [user],
          },
        },
      })
    );
  };

  const removeCollaborator = (index, user) => {
    const searchedCollaboratorIndex = projects[index].collaborators.findIndex(
      ({ id }) => id === user.id
    );
    if (searchedCollaboratorIndex === -1) return;
    setProjects(
      update(projects, {
        [index]: {
          collaborators: {
            $splice: [[searchedCollaboratorIndex, 1]],
          },
        },
      })
    );
  };

  const editFields = (index, data) => {
    setProjects(update(projects, { [index]: { $merge: data } }));
  };

  const onSubmit = async (campaignData, e) => {
    setIsLoading(true);
    await getNames();
    e.preventDefault();
    if (campaignNames.includes(campaignData.name)) {
      return toastUtils.error("A campaign with that name already exists");
    }
    if (projectsHaveDuplicateNames()) {
      return toastUtils.error("One or more projects have duplicate names");
    }
    if (!projectsHaveRequiredFields()) {
      return toastUtils.error(
        "All projects must have a name, a deadline date and a channel"
      );
    }
    try {
      campaignData.projects = projects.map((project) => {
        let type;
        let channel;
        if (channelSocialOptions.includes(project.channel)) {
          type = "social";
          channel = project.channel;
        } else {
          type = project.channel;
        }
        return {
          ...project,
          type,
          channel,
        };
      });
      await campaignApi.createCampaign(campaignData);
      if (Router.route !== "/main/schedule") {
        Router.replace("/main/schedule");
      } else {
        setNeedItemReset(true);
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

  const projectsHaveRequiredFields = () => {
    return projects.every(
      ({ name, publishDate, channel }) =>
        name && publishDate && channel !== EMPTY_CHANNEL
    );
  };

  const projectsHaveDuplicateNames = () => {
    return projects.some(
      ({ name }, index) =>
        projectNames.includes(name) ||
        projects
          .filter((_, proIndex) => index !== proIndex)
          .map((otherProject) => otherProject.name)
          .includes(name)
    );
  };

  const getNames = async () => {
    try {
      const { data: campaignsData } = await campaignApi.getCampaigns();
      setCampaignNames(campaignsData.map((campaign) => campaign.name));

      const { data: projectsData } = await projectApi.getProjects();
      setProjectNames(projectsData.map((project) => project.name));
    } catch (err) {
      // TODO: Error handling
    }
  };

  return (
    <div className={`${styles.container}`}>
      <h2>Create New Campaign</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`create-overlay-form ${styles["create-form"]}`}
      >
        <div className={styles["input-wrapper"]}>
          <FormInput
            InputComponent={
              <Input
                type="text"
                placeholder="Name your Campaign"
                styleType="regular"
                additionalClasses={styles["campaign-input"]}
              />
            }
            name="name"
            control={control}
            message={"This field should be between 1 and 30 characters long"}
            rules={{ minLength: 1, maxLength: 30, required: true }}
            errors={errors}
          />
        </div>
        <CreateCampaignProjects
          editFields={editFields}
          projects={projects}
          addProject={addProject}
          ownerId={user.id}
          addCollaborator={addCollaborator}
          removeCollaborator={removeCollaborator}
          removeProject={removeProject}
        />
        <div className={styles["button-wrapper"]}>
          <Button
            type={"submit"}
            text={"Save changes"}
            className="container submit primary"
          />
        </div>
      </form>
    </div>
  );
};

export default CreateCampaign;
