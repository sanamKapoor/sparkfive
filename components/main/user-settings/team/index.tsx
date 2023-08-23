import { useState } from "react";
import styles from "./index.module.css";

// Components
import SpinnerOverlay from "../../../common/spinners/spinner-overlay";
import SwitchableTabsWithProps from "../../../common/switchable-tabs-with-props";
import AddCustomRole from "./add-custom-role";
import Members from "./members";
import Roles from "./roles";

const Team: React.FC = () => {
  const [selectedMember, setSelectedMember] = useState(undefined);
  const [selectedRole, setSelectedRole] = useState<string>(undefined);

  const [activeTab, setActiveTab] = useState<string>("members");

  const [loading, setLoading] = useState<boolean>(false);

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
        selectedMember,
        setSelectedMember,
      },
    },
    {
      id: "roles",
      title: "Roles",
      content: Roles,
      props: {
        onAdd: () => setActiveTab("addCustomRole"),
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

  const handleOnTabsClick = (tabId: string) => {
    if (tabId === "members" || tabId === "roles") {
      setSelectedRole(undefined);
      setSelectedMember(undefined);
    }
  };

  return (
    <div className={styles.container}>
      <SwitchableTabsWithProps
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        data={data}
        onClick={handleOnTabsClick}
      />
      {loading && <SpinnerOverlay />}
    </div>
  );
};

export default Team;
