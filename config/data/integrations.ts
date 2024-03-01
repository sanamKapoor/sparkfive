import AvailableIntegrations from "../../components/common/account/available-integrations";
import EnabledIntegrations from "../../components/common/account/enabled-integrations";

export const integrationTabsData = [
  {
    id: "enabled",
    title: "Enabled",
    content: EnabledIntegrations,
    permissions: [],
  },
  {
    id: "available",
    title: "Available",
    content: AvailableIntegrations,
    permissions: [],
  },
];
