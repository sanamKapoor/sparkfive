import Billing from "../../components/main/user-settings/account/billing";
import Company from "../../components/main/user-settings/account/company";
import Profile from "../../components/main/user-settings/account/profile";
import Security from "../../components/main/user-settings/account/security";

import {
  SETTINGS_BILLING,
  SETTINGS_COMPANY,
  SETTINGS_SECURITY,
} from "./../../constants/permissions";

export const tabsData = [
  {
    id: "profile",
    title: "Profile",
    content: Profile,
    permissions: [],
  },
  {
    id: "billing",
    title: "Billing",
    content: Billing,
    permissions: [SETTINGS_BILLING],
  },
  {
    id: "company",
    title: "Company",
    content: Company,
    permissions: [SETTINGS_COMPANY],
  },
  {
    id: "security",
    title: "Security",
    content: Security,
    permissions: [SETTINGS_SECURITY],
  },
];
