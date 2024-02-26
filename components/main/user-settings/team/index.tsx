import { useEffect, useState } from "react";
import styles from "./index.module.css";

// Components
import { IRole } from "../../../../interfaces/user/role";
import SpinnerOverlay from "../../../common/spinners/spinner-overlay";
import SwitchableTabsWithProps from "../../../common/switchable-tabs-with-props";
import AddCustomRole from "./add-custom-role";
import Members from "./members";
import Roles from "./roles";
import { pages } from "../../../../constants/analytics";
import useAnalytics from "../../../../hooks/useAnalytics";

const Team: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<IRole | undefined>(
    undefined
  );

  const [activeTab, setActiveTab] = useState<string>("members");

  const [loading, setLoading] = useState<boolean>(false);

  const { pageVisit } = useAnalytics();

  useEffect(() => {    
    pageVisit(pages.TEAM)
  },[]);

  const onAddCustomRole = () => {
    setActiveTab("roles");
    setSelectedRole(undefined);
  };

  const data = [
    {
      id: "members",
      title: "Members",
      content: Members,
      props: {
        loading,
        setLoading,
      },
    },
    {
      id: "roles",
      title: "Roles",
      content: Roles,
      props: {
        onAdd: () => {
          setActiveTab("addCustomRole");
          setSelectedRole(undefined);
        },
        onEdit: (id: string) => {
          setActiveTab("addCustomRole");
          setSelectedRole(id);
        },
      },
    },
    activeTab === "addCustomRole" && {
      id: "addCustomRole",
      title: "Add Custom Role",
      content: AddCustomRole,
      props: {
        onSave: onAddCustomRole,
        role: selectedRole,
      },
    },
  ];

  return (
    <div className={styles.container}>
      <SwitchableTabsWithProps
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        data={data}
      />
      {loading && <SpinnerOverlay />}
    </div>
  );
};

export default Team;
