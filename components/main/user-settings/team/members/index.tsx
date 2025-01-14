import { useContext, useEffect, useState } from "react";
import styles from "../index.module.css";

import update from "immutability-helper";
import { TeamContext } from "../../../../../context";
import useRoles from "../../../../../hooks/use-roles";
import {
  IEditType,
  IRequestFormData,
  ITeamMember,
} from "../../../../../interfaces/team/team";
import teamApi from "../../../../../server-api/team";
import toastUtils from "../../../../../utils/toast";
import ConfirmModal from "../../../../common/modals/confirm-modal";
import AccessRequests from "./access-requests";
import PendingInvites from "./pending-invites";
import TeamInvite from "./team-invite-form";
import TeamMembers from "./team-members";

import inviteApi from "../../../../../server-api/invite";
import MemberDetail from "./team-members/member-detail";

import requestApi from "../../../../../server-api/request";

interface MembersProps {
  loading: boolean;
  setLoading: (val: boolean) => void;
}

const Members: React.FC<MembersProps> = ({ loading, setLoading }) => {
  const { mappedRoles } = useRoles();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedMember, setSelectedMember] = useState<ITeamMember>(undefined);

  const { teamMembers, getTeamMembers, setTeamMembers } =
    useContext(TeamContext);

  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  const [editType, setEditType] = useState<IEditType>("member");

  const [requests, setRequests] = useState<IRequestFormData[]>([]);
  const [invites, setInvites] = useState([]);

  useEffect(() => {
    getTeamMembers();
    getAccessRequest();
    getInvites();
  }, []);

  const getAccessRequest = async () => {
    try {
      const { data } = await requestApi.getRequests();
      setRequests(data);
    } catch (err) {
      console.log(err);
    }
  };

  const getInvites = async () => {
    try {
      const { data } = await inviteApi.getInvites();
      setInvites(data);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteMember = async () => {
    try {
      setLoading(true);
      if (editType === "member") {
        await teamApi.disableTeamMember(selectedMember?.id);
        setTeamMembers(
          update(teamMembers, {
            $splice: [
              [
                teamMembers.findIndex(
                  (member) => member.id === selectedMember?.id
                ),
                1,
              ],
            ],
          })
        );
      } else if (editType === "invite") {
        await inviteApi.deleteInvite(selectedMember?.id);
        setInvites(
          update(invites, {
            $splice: [
              [
                invites.findIndex((invite) => invite.id === selectedMember?.id),
                1,
              ],
            ],
          })
        );
      }
      setIsModalOpen(false);
      toastUtils.success("Member deleted successfully");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      setSelectedMember(undefined);
    }
  };

  const onDetailSaveChanges = async (
    id,
    { roleId, permissions, updatePermissions }
  ) => {
    try {
      setLoading(true);
      if (editType === "member")
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
  return (
    <>
      {isEditMode ? (
        <MemberDetail
          type={editType}
          mappedRoles={mappedRoles}
          member={selectedMember}
          onSaveChanges={onDetailSaveChanges}
          onCancel={() => {
            setIsEditMode(false);
            setSelectedMember(undefined);
          }}
        />
      ) : (
        <>
          <TeamInvite
            invites={invites}
            setInvites={setInvites}
            mappedRoles={mappedRoles}
          />
          <div className={styles.divider}></div>
          <TeamMembers
            setSelectedMember={setSelectedMember}
            setIsModalOpen={setIsModalOpen}
            setIsEditMode={setIsEditMode}
            setEditType={setEditType}
          />
          <PendingInvites
            invites={invites}
            setInvites={setInvites}
            setIsEditMode={setIsEditMode}
            setSelectedMember={setSelectedMember}
            setIsModalOpen={setIsModalOpen}
            setEditType={setEditType}
          />
          <AccessRequests
            requests={requests}
            getAccessRequest={getAccessRequest}
            setLoading={setLoading}
          />
        </>
      )}

      <ConfirmModal
        subText=""
        modalIsOpen={isModalOpen}
        closeModal={() => {
          setSelectedMember(undefined);
          setIsModalOpen(false);
        }}
        confirmAction={deleteMember}
        confirmText={"Delete"}
        message={`Are you sure you want to delete ${selectedMember?.email}?`}
      />
    </>
  );
};

export default Members;
