import { useContext, useEffect, useState } from "react";
import styles from "../index.module.css";

import { capitalCase } from "change-case";
import update from "immutability-helper";
import { Utilities } from "../../../../../assets";
import { TeamContext } from "../../../../../context";
import inviteApi from "../../../../../server-api/invite";
import requestApi from "../../../../../server-api/request";
import roleApi from "../../../../../server-api/role";
import teamApi from "../../../../../server-api/team";
import { ITeamMember } from "../../../../../types/team/team";
import toastUtils from "../../../../../utils/toast";
import IconClickable from "../../../../common/buttons/icon-clickable";
import ConfirmModal from "../../../../common/modals/confirm-modal";
import AccessRequests from "./access-requests";
import RequestForm from "./access-requests/request-form";
import PendingInvites from "./pending-invites";
import TeamInvite from "./team-invite-form";
import TeamMembers from "./team-members";
import MemberDetail from "./team-members/member-detail";

interface MembersProps {
  loading: boolean;
  setLoading: (val: boolean) => void;
}

const Members: React.FC<MembersProps> = ({ loading, setLoading }) => {
  const [selectedMember, setSelectedMember] = useState<ITeamMember>();
  const [selectedRequest, setSelectedRequest] = useState();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [roles, setRoles] = useState([]);
  const { teamMembers, getTeamMembers, setTeamMembers } =
    useContext(TeamContext);

  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [requests, setRequests] = useState([]);
  const [invites, setInvites] = useState([]);

  useEffect(() => {
    getTeamMembers();
    getRoles();
    getAccessRequest();
  }, []);

  const sendInvitation = async (email, roleId) => {
    try {
      const { data } = await inviteApi.sendInvite({ email, roleId });
      setInvites(
        update(invites, {
          $push: [data],
        })
      );
      toastUtils.success(`Invitation sent to ${email}`);
    } catch (err) {
      console.log(err);
      if (err.response?.data?.message)
        toastUtils.error(err.response.data.message);
      else toastUtils.error(`Coudl not send invitation to ${email}`);
    }
  };

  const mappedRoles = roles.map((role) => ({
    ...role,
    label: capitalCase(role.name),
    value: role.id,
  }));

  const getRoles = async () => {
    try {
      const { data } = await roleApi.getroles();
      setRoles(data);
    } catch (err) {
      console.log(err);
    }
  };

  const onDetailSaveChanges = async (
    id,
    { roleId, permissions, updatePermissions }
  ) => {
    try {
      setLoading(true);
      await teamApi.patchTeamMember(id, {
        roleId,
        permissions,
        updatePermissions,
      });

      getTeamMembers();

      setIsEditMode(false);

      setSelectedMember(undefined);

      toastUtils.success("Changes saved successfully");
    } catch (err) {
      toastUtils.error(err.response.data?.message || "Internal server error");
    } finally {
      setLoading(false);
    }
  };

  const deleteMember = async () => {
    try {
      setLoading(true);
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

      setIsModalOpen(false);
      toastUtils.success("Member deleted successfully");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      setSelectedMember(undefined);
    }
  };

  const getAccessRequest = async () => {
    try {
      const { data } = await requestApi.getRequests();
      setRequests(data);
    } catch (err) {
      console.log(err);
    }
  };

  const onRequestChange = async (type: string, request) => {
    switch (type) {
      case "review": {
        setSelectedRequest(request);
        break;
      }
      case "accept": {
        setLoading(true);
        await requestApi.approve(request.id);
        await getAccessRequest();
        toastUtils.success("Approve successfully");
        setSelectedRequest(undefined);
        setLoading(false);
        break;
      }
      case "reject": {
        setLoading(true);
        await requestApi.reject(request.id);
        await getAccessRequest();
        toastUtils.success("Reject successfully");
        setSelectedRequest(undefined);
        setLoading(false);
        break;
      }
    }
  };

  return (
    <>
      {isEditMode ? (
        <MemberDetail
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
          <TeamInvite onInviteSend={sendInvitation} mappedRoles={mappedRoles} />
          <div className={styles.divider}></div>
          <TeamMembers
            setSelectedMember={setSelectedMember}
            setIsModalOpen={setIsModalOpen}
            setIsEditMode={setIsEditMode}
          />
          <PendingInvites
            setIsEditMode={setIsEditMode}
            setSelectedMember={setSelectedMember}
          />
          <AccessRequests
            requests={requests}
            onRequestChange={onRequestChange}
          />
        </>
      )}

      {selectedRequest && (
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
      )}

      <ConfirmModal
        headText=""
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
