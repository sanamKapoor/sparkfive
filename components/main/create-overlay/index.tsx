import { useContext } from "react";
import { ProjectTypes, Utilities } from "../../../assets";
import { LoadingContext } from "../../../context";
import styles from "./index.module.css";

// Components
import SpinnerOverlay from "../../common/spinners/spinner-overlay";
import CreateCampaign from "./create-campaign";
import CreateItem from "./create-item";
import CreateProject from "./create-project";
import CreateTask from "./create-task";

const CreateOverlay = ({ type = "", setType, closeOverlay, endDate = "" }) => {
  const { isLoading } = useContext(LoadingContext);

  return (
    <div className={`app-overlay ${styles.container}`}>
      {isLoading && <SpinnerOverlay />}
      <div className={styles.top}>
        <div className={styles.back} onClick={closeOverlay}>
          {type && (
            <>
              <img src={Utilities.back} />
              <span>Back</span>
            </>
          )}
        </div>
        <div className={styles.close} onClick={closeOverlay}>
          <span className={styles.x}>X</span>
          <span>esc</span>
        </div>
      </div>
      {!type && (
        <div>
          <h2 className={styles.chooseTitle}>Choose Type</h2>
          <ul className={styles.types}>
            <CreateItem
              type="campaign"
              description="Lorep ipsum dolor sit amet, consectetur edil, sed do eiusmod tempor."
              icon={ProjectTypes.campaign}
              onClick={() => setType("campaign")}
            />
            <CreateItem
              type="project"
              description="Lorep ipsum dolor sit amet, consectetur edil, sed do eiusmod tempor."
              icon={ProjectTypes.project}
              onClick={() => setType("project")}
            />
            <CreateItem
              type="task"
              description="Lorep ipsum dolor sit amet, consectetur edil, sed do eiusmod tempor."
              icon={ProjectTypes.task}
              onClick={() => setType("task")}
            />
          </ul>
        </div>
      )}
      {type === "campaign" && <CreateCampaign />}
      {type === "project" && <CreateProject publishDate={endDate} />}
      {type === "task" && <CreateTask endDate={endDate} />}
    </div>
  );
};

export default CreateOverlay;
