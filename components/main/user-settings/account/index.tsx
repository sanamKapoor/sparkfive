import Tabs from "../../../common/tabs";
import Billing from "./billing";
import Company from "./company";
import Profile from "./profile";
import Security from "./security";

const accountTabs = {
  Profile,
  Billing,
  Company,
  Security,
};

const Account = () => {
  return <Tabs data={accountTabs} />;
};

export default Account;
