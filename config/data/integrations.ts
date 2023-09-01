import AvailableIntegrations from "../../components/common/account/available-integrations";
import EnabledIntegrations from "../../components/common/account/enabled-integrations";

export const integrationTabsData = [
  {
    id: "enabled",
    title: "Enabled",
    content: EnabledIntegrations,
  },
  {
    id: "available",
    title: "Available",
    content: AvailableIntegrations,
  },
];
