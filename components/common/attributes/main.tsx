// Components
import { tabsData } from "../../../config/data/attributes";
import SwitchableTabs from "../switchable-tabs";

const Main: React.FC = () => {
  return <SwitchableTabs initialActiveTab="tags" data={tabsData} />;
};

export default Main;
