// Components
import { integrationTabsData } from "../../../config/data/integrations";
import SwitchableTabs from "../switchable-tabs";

const Integrations: React.FC = () => {
  return (
    <>
      <SwitchableTabs initialActiveTab="enabled" data={integrationTabsData} />
    </>
  );
};

export default Integrations;
