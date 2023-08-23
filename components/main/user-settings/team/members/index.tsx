import { useContext, useEffect, useState } from "react";
import styles from "../index.module.css";

import update from "immutability-helper";
import { TeamContext } from "../../../../../context";
import useRoles from "../../../../../hooks/use-roles";
import teamApi from "../../../../../server-api/team";
import {
  IEditType,
  IRequestFormData,
  ITeamMember,
} from "../../../../../types/team/team";
import toastUtils from "../../../../../utils/toast";
import ConfirmModal from "../../../../common/modals/confirm-modal";
import AccessRequests from "./access-requests";
import PendingInvites from "./pending-invites";
import TeamInvite from "./team-invite-form";
import TeamMembers from "./team-members";

import inviteApi from "../../../../../server-api/invite";
import requestApi from "../../../../../server-api/request";
import EditDetailsView from "./edit-details-view";

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

  const [selectedRequest, setSelectedRequest] = useState<IRequestFormData>();
  const [requests, setRequests] = useState<IRequestFormData[]>([]);
  const [invites, setInvites] = useState([]);

  useEffect(() => {
    getTeamMembers();
    getAccessRequest();
    getInvites();
  }, []);

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

  const getAccessRequest = async () => {
    try {
      const { data } = await requestApi.getRequests();
      setRequests(data);
    } catch (err) {
      console.log(err);
    }
  };

  const onRequestChange = async (type: string, request) => {
    setEditType("request");
    switch (type) {
      case "review": {
        setSelectedRequest(request);
        break;
      }
      case "accept": {
        setLoading(true);
        await requestApi.approve(request.id);
        getAccessRequest();
        toastUtils.success("Approve successfully");
        setSelectedRequest(undefined);
        setLoading(false);
        break;
      }
      case "reject": {
        setLoading(true);
        await requestApi.reject(request.id);
        getAccessRequest();
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
        <EditDetailsView
          type={editType}
          selectedMember={selectedMember}
          setIsEditMode={setIsEditMode}
          setSelectedMember={setSelectedMember}
          setLoading={setLoading}
          selectedRequest={selectedRequest}
          setSelectedRequest={setSelectedRequest}
          onRequestChange={onRequestChange}
          getInvites={getInvites}
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
            setIsEditMode={setIsEditMode}
            setSelectedMember={setSelectedMember}
            setIsModalOpen={setIsModalOpen}
            setEditType={setEditType}
          />
          <AccessRequests
            requests={requests}
            onRequestChange={onRequestChange}
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
