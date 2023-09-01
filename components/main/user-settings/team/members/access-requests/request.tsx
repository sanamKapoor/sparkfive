import { useContext, useState } from "react";
import { UserContext } from "../../../../../../context";
import useRoles from "../../../../../../hooks/use-roles";
import { IRequestFormData } from "../../../../../../types/team/team";
import { IRole } from "../../../../../../types/user/role";
import Select from "../../../../../common/inputs/select";
import styles from "./request.module.css";

interface RequestProps {
  id: string;
  email: string;
  name: string;
  onChange: (val: string) => void;
  selectedRequest: IRequestFormData;
  setSelectedRequest: (val: IRequestFormData) => void;
}

const Request: React.FC<RequestProps> = ({
  id,
  email,
  name,
  onChange,
  selectedRequest,
  setSelectedRequest,
}) => {
  const { user } = useContext(UserContext);

  const [selectedRole, setSelectedRole] = useState<IRole>();

  const { mappedRoles } = useRoles();

  return (
    <li className={styles.container}>
      <div className={styles["name-email"]}>
        <div>{name}</div>
        <div>{email}</div>
      </div>

      <div className={styles["role-select-wrapper"]}>
        <Select
          options={mappedRoles}
          onChange={(selected) => {
            setSelectedRole(selected);
            setSelectedRequest({ ...selectedRequest, roleId: selected.id });
          }}
          placeholder={"Select a role"}
          styleType="regular"
          value={selectedRole}
        />
      </div>
      <div className={styles.details}>
        {user.id !== id && (
          <>
            <div
              onClick={() => {
                onChange("review");
              }}
              className={styles.action}
            >
              Review
            </div>
            <div
              onClick={() => {
                onChange("accept");
              }}
              className={styles.approve}
            
            >
              Approve
            </div>
            <div
              onClick={() => {
                onChange("reject");
              }}
              className={styles.reject}
            >
              Reject
            </div>
          </>
        )}
      </div>
    </li>
  );
};

export default Request;
