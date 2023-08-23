import React, { useContext } from "react";
import useRoles from "../../../../../hooks/use-roles";
import { IRequestFormData, ITeamMember } from "../../../../../types/team/team";
import RequestForm from "./access-requests/request-form";
import MemberDetail from "./team-members/member-detail";

import { TeamContext } from "../../../../../context";
import inviteApi from "../../../../../server-api/invite";
import teamApi from "../../../../../server-api/team";
import toastUtils from "../../../../../utils/toast";

import styles from "../../index.module.css";

import { Utilities } from "../../../../../assets";
import IconClickable from "../../../../common/buttons/icon-clickable";

interface EditDetailsViewProps {
  type: "member" | "invite" | "request";
  selectedMember: ITeamMember;
  setIsEditMode: (val: boolean) => void;
  setSelectedMember: (member: ITeamMember) => void;
  setLoading: (val: boolean) => void;
  selectedRequest: IRequestFormData;
  onRequestChange: (type, request) => void;
  setSelectedRequest: (val: IRequestFormData) => void;
  getInvites: () => void;
}

const EditDetailsView: React.FC<EditDetailsViewProps> = ({
  type,
  selectedMember,
  setIsEditMode,
  setSelectedMember,
  setLoading,
  selectedRequest,
  onRequestChange,
  setSelectedRequest,
  getInvites,
}) => {
  const { mappedRoles } = useRoles();
  const { getTeamMembers } = useContext(TeamContext);

  const onDetailSaveChanges = async (
    id,
    { roleId, permissions, updatePermissions }
  ) => {
    try {
      setLoading(true);
      if (type === "member")
        await teamApi.patchTeamMember(id, {
          roleId,
          permissions,
          updatePermissions,
        });
      else
        await inviteApi.patchInvite(id, {
          roleId,
          permissions,
          updatePermissions,
        });

      await getTeamMembers();
      await getInvites();

      setIsEditMode(false);
      setSelectedMember(undefined);

      toastUtils.success("Changes saved successfully");
    } catch (err) {
      toastUtils.error(err.response.data?.message || "Internal server error");
    } finally {
      setLoading(false);
    }
  };

  switch (type) {
    case "member":
    case "invite":
      return (
        <MemberDetail
          type={type}
          mappedRoles={mappedRoles}
          member={selectedMember}
          onSaveChanges={onDetailSaveChanges}
          onCancel={() => {
            setIsEditMode(false);
            setSelectedMember(undefined);
          }}
        />
      );
    case "request":
      return (
        <>
          <div
            className={styles.back}
            onClick={() => {
              setSelectedRequest(undefined);
            }}
          >
            <IconClickable src={Utilities.back} />
            <span>Back</span>
          </div>
          <RequestForm
            data={selectedRequest}
            onApprove={() => {
              onRequestChange("accept", selectedRequest);
            }}
            onReject={() => {
              onRequestChange("reject", selectedRequest);
            }}
          />
        </>
      );
    default:
      return null;
  }
};

export default EditDetailsView;
