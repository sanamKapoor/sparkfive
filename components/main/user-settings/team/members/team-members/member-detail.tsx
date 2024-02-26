import { useEffect, useState } from "react";
import styles from "./member-detail.module.css";

import { default as permissionList } from "../../../../../../constants/permissions";
import { ITeamMember } from "../../../../../../interfaces/team/team";
import permissionApi from "../../../../../../server-api/permission";
import Button from "../../../../../common/buttons/button";
import Select from "../../../../../common/inputs/select";
import MemberPermissions from "./member-permissions";

interface MemberDetailProps {
  member: ITeamMember;
  type: "member" | "invite";
  mappedRoles: { id: string; name: string; label: string; value: string }[];
  onSaveChanges: (id: string, data: unknown) => void;
  onCancel: () => void;
}

const MemberDetail: React.FC<MemberDetailProps> = ({
  member,
  type = "member",
  mappedRoles,
  onSaveChanges,
  onCancel,
}) => {
  const [memberRole, setMemberRole] = useState(member?.role);
  const [memberPermissions, setMemberPermissions] = useState([]);
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    setMemberRole(member.role);
  }, [member]);

  const onRoleChange = (role) => {
    if (role.id === "user") {
      let permission = permissions.filter((item, index) => {
        return [
          permissionList.ASSET_ACCESS,
          permissionList.ASSET_DOWNLOAD,
          permissionList.ASSET_SHARE,
        ].includes(item.id);
      });
      setMemberPermissions(permission);
    }

    setMemberRole(role);
  };

  useEffect(() => {
    getPermissions();
  }, []);

  useEffect(() => {
    if (member) {
      setMemberRole(getMemberRole(member.role));
      setMemberPermissions(member.permissions);
    }
  }, [member]);

  const getMemberRole = (role) => {
    return mappedRoles.find((mappedRole) => mappedRole.id === role.id);
  };

  const getPermissions = async () => {
    try {
      const { data } = await permissionApi.getPermissions();
      setPermissions(data);
    } catch (err) {
      console.log(err);
    }
  };

  const onSaveMemberChanges = () => {
    const saveData = {
      permissions: memberPermissions,
      updatePermissions: true,
      roleId: memberRole.id,
    };

    onSaveChanges(member.id, saveData);
  };

  return (
    <div className={styles.container}>
      <div className={styles.headers}>
        {type === "member" && <h3>Name</h3>}
        <h3>Email Address</h3>
        <h3>Roles</h3>
      </div>
      <div className={styles.fields}>
        {type === "member" && <div>{member.name}</div>}
        <div className={styles.emailaddress}>{member.email}</div>
        <div className={styles.selectcontainer}>
          <Select
            options={mappedRoles}
            onChange={(selected) => onRoleChange(selected)}
            placeholder={"Select a role"}
            styleType="regular"
            value={memberRole}
            containerClass={styles.memberDetailInfo}
         
          />
        </div>
      </div>
      {memberRole && memberRole.type === "preset" && (
        <MemberPermissions
          memberPermissions={memberPermissions}
          permissions={permissions}
          setMemberPermissions={setMemberPermissions}
          listOnly={true}
        />
      )}
      <div className={styles["button-wrapper"]}>
        <Button
          text="Save Changes"
          type="button"
          onClick={onSaveMemberChanges}
          className={"container primary"}
        />

        <Button
          className={"container m-l-15 secondary"}
          text="Cancel"
          type="button"
          onClick={onCancel}
        />
      </div>
    </div>
  );
};

export default MemberDetail;
