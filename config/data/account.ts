import Billing from "../../components/main/user-settings/account/billing";
import Company from "../../components/main/user-settings/account/company";
import Profile from "../../components/main/user-settings/account/profile";
import Security from "../../components/main/user-settings/account/security";

export const tabsData = [
  {
    id: "profile",
    title: "Profile",
    content: Profile,
  },
  {
    id: "billing",
    title: "Billing",
    content: Billing,
  },
  {
    id: "company",
    title: "Company",
    content: Company,
  },
  {
    id: "security",
    title: "Security",
    content: Security,
  },
];
