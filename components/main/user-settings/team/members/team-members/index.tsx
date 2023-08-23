import React, { useContext, useEffect } from "react";
import { TeamContext } from "../../../../../../context";
import { ITeamMember } from "../../../../../../types/team/team";
import styles from "../../index.module.css";
import MemberList from "./member-list";

interface TeamMembersProps {
  setSelectedMember: (data: ITeamMember) => void;
  setIsModalOpen: (val: boolean) => void;
  setIsEditMode: (val: boolean) => void;
}

const TeamMembers: React.FC<TeamMembersProps> = ({
  setSelectedMember,
  setIsModalOpen,
  setIsEditMode,
}) => {
  const { teamMembers, getTeamMembers } = useContext(TeamContext);

  useEffect(() => {
    getTeamMembers();
  }, []);

  return (
    <>
      <div className={styles.content}>
        <div className={styles["main-headers"]}>
          <h3>Members</h3>
          <h3>Role</h3>
        </div>
        <MemberList
          members={teamMembers}
          setSelectedMember={setSelectedMember}
          setIsModalOpen={setIsModalOpen}
          setIsEditMode={setIsEditMode}
        />
      </div>
    </>
  );
};

export default TeamMembers;
