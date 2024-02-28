import { useState } from "react";
import { ITeam } from "../../../../interfaces/team/team";
import SpinnerOverlay from "../../../common/spinners/spinner-overlay";
import SwitchableTabsWithProps from "../../../common/switchable-tabs-with-props";
import AccountTable from "../SuperAdmin/AccountTable/AccountTable";
import UserTable from "../SuperAdmin/UserTable/UserTable";
import CompanySettingsView from "./company-settings-view";

const SuperAdmin = () => {
  const [activeTab, setActiveTab] = useState<string>("allUsers");
  const [showSettingsView, setShowSettingsView] = useState<boolean>(false);
  const [activeAccountData, setActiveAccountData] = useState<ITeam>();

  const [loading, setLoading] = useState<boolean>(false);

  const [benefits, setBenefits] = useState([]);

  const onViewCompanySettings = (accountDetail: ITeam, benefits) => {
    setShowSettingsView(true);
    setActiveAccountData(accountDetail);
    setBenefits(
      benefits.map((benefit) => {
        return {
          label: benefit.id,
          value: benefit.id,
        };
      })
    );
  };

  const onBack = () => {
    setShowSettingsView(false);
    setActiveAccountData(undefined);
  };

  const data = [
    {
      id: "allUsers",
      title: "All Users",
      content: UserTable,
      props: {},
    },
    {
      id: "allAccounts",
      title: "All Accounts",
      content: AccountTable,
      props: {
        onViewCompanySettings,
        onBack,
      },
    },
  ];
  return (
    <div>
      {showSettingsView ? (
        <CompanySettingsView
          benefits={benefits}
          onBack={onBack}
          data={activeAccountData}
          loading={loading}
          setLoading={setLoading}
        />
      ) : (
        <SwitchableTabsWithProps
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          data={data}
        />
      )}
      {loading && <SpinnerOverlay />}
    </div>
  );
};

export default SuperAdmin;
