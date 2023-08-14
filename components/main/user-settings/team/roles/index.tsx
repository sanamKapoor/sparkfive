import { Utilities } from "../../../../../assets";
import IconClickable from "../../../../common/buttons/icon-clickable";
import styles from "./index.module.css";

import { capitalCase } from "change-case";
import { useEffect, useState } from "react";
import teamApi from "../../../../../server-api/team";
import { IRole } from "../../../../../types/user/role";
import ConfirmModal from "../../../../common/modals/confirm-modal";
import SpinnerOverlay from "../../../../common/spinners/spinner-overlay";

interface RolesProps {
  onAdd: () => void;
  onEdit: (roleId: string) => void;
}

const Roles: React.FC<RolesProps> = ({ onAdd, onEdit }) => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<IRole>();

  const getRoleList = async () => {
    const { data } = await teamApi.getRoles();
    setRoles(data);
    setLoading(false);
  };

  const deleteRole = async () => {
    setOpenModal(false);
    if (selectedRole) {
      setLoading(true);
      // @ts-ignore
      await teamApi.deleteRole(selectedRole.id);

      getRoleList();
    }
  };

  useEffect(() => {
    getRoleList();
  }, []);

  return (
    <div className={styles.content}>
      <div className={styles["select-add-wrapper"]}>
        <div className={`add ${styles["select-add"]}`} onClick={onAdd}>
          <IconClickable src={Utilities.add} />
          <span>Add New Custom Role</span>
        </div>
      </div>

      <h3>Roles</h3>

      {roles.map((role, index) => {
        return (
          <div
            className={`row align-center ${styles["data-row"]} ${
              index === roles.length - 1 ? "" : styles["ghost-line"]
            }`}
            key={index}
          >
            <div className={`col-30 ${styles["name-col"]}`}>
              <p>{role.name}</p>
            </div>
            <div className={`col-15 ${styles["action"]}`}>
              <span>{capitalCase(role.type)}</span>
            </div>
            {role.type !== "preset" && (
              <div
                className={`col-5 align-center pointer ${styles["action"]}`}
                onClick={() => {
                  onEdit(role.id);
                }}
              >
                Edit
              </div>
            )}
            {role.type !== "preset" && (
              <div
                className={`col-5 align-center pointer ${styles["action"]}`}
                onClick={() => {
                  setSelectedRole(role);
                  setOpenModal(true);
                }}
              >
                Delete
              </div>
            )}
          </div>
        );
      })}

      <ConfirmModal
        headText=""
        subText=""
        modalIsOpen={openModal}
        closeModal={() => {
          setSelectedRole(undefined);
          setOpenModal(false);
        }}
        confirmAction={deleteRole}
        confirmText={"Delete"}
        message={`Are you sure you want to delete ${selectedRole?.name}?`}
      />

      {loading && <SpinnerOverlay />}
    </div>
  );
};

export default Roles;
