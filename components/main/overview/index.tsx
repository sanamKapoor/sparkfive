import { startOfDay } from "date-fns";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context";
import projectApi from "../../../server-api/project";
import taskApi from "../../../server-api/task";
import styles from "./index.module.css";

// Components
import CreateOverlay from "../create-overlay";
import OverviewSubHeader from "./overview-subheader";
import SchedulingReport from "./scheduling-report";
import Upcoming from "./upcoming";
import UpcomingTasks from "./upcoming-tasks";

const Overview = () => {
  const [createVisible, setCreateVisible] = useState(false);
  const [createType, setCreateType] = useState("");

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  const { user } = useContext(UserContext);

  const DEFAULT_DATE = startOfDay(new Date()).toISOString();

  const openCreateOVerlay = (type) => {
    setCreateVisible(true);
    setCreateType(type);
  };

  useEffect(() => {
    getProjects();
    getTasks();
  }, []);

  const deleteProject = async (index) => {
    try {
      await projectApi.deleteProject(projects[index].id);
      getProjects();
    } catch (err) {
      // TODO: Handle error
    }
  };

  const getProjects = async () => {
    try {
      const { data } = await projectApi.getProjects({ fromDate: DEFAULT_DATE });
      setProjects(data);
    } catch (err) {
      // TODO: Display error or something
    }
  };

  const getTasks = async () => {
    try {
      const { data } = await taskApi.getOwnedTasks({ fromDate: DEFAULT_DATE });
      setTasks(data);
    } catch (err) {
      // TODO: Display error or something
    }
  };

  useEffect(() => {
    if (createVisible) {
      document.body.classList.add("no-overflow");
    } else {
      document.body.classList.remove("no-overflow");
    }
  }, [createVisible]);

  return (
    <>
      <OverviewSubHeader openCreateOVerlay={openCreateOVerlay} />
      <main className={`${styles.container}`}>
        <h1>{`Welcome back, ${user?.name.split(" ")[0]}`}</h1>
        <section className={styles["first-section"]}>
          <SchedulingReport />
          <Upcoming
            type="project"
            items={projects.slice(0, 5)}
            addOnClick={() => openCreateOVerlay("project")}
            deleteItem={deleteProject}
          />
        </section>
        <section className={styles["second-section"]}>
          <UpcomingTasks tasks={tasks.slice(0, 5)} />
          {/* TODO: Add help section in a future milestone */}
        </section>
      </main>
      {createVisible && (
        <CreateOverlay
          type={createType}
          setType={setCreateType}
          closeOverlay={() => setCreateVisible(false)}
        />
      )}
    </>
  );
};

export default Overview;
