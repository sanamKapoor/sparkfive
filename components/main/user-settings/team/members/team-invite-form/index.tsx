import { useState } from "react";
import { IRole } from "../../../../../../interfaces/user/role";
import Button from "../../../../../common/buttons/button";
import Input from "../../../../../common/inputs/input";
import Select from "../../../../../common/inputs/select";
import styles from "./team-invite-form.module.css";

import inviteApi from "../../../../../../server-api/invite";
import toastUtils from "../../../../../../utils/toast";

import update from "immutability-helper";
import { ITeamMember } from "../../../../../../interfaces/team/team";

interface TeamInviteProps {
  invites: ITeamMember[];
  setInvites: (data: ITeamMember[]) => void;
  mappedRoles: IRole[];
}

const TeamInviteForm: React.FC<TeamInviteProps> = ({
  mappedRoles,
  invites,
  setInvites,
}) => {
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState(undefined);

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
      else toastUtils.error(`Could not send invitation to ${email}`);
    }
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    await sendInvitation(inviteEmail, inviteRole.value);
    setInviteEmail("");
    setInviteRole(undefined);
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={onSubmitForm}>
        <Input
          type="email"
          styleType="regular"
          value={inviteEmail}
          placeholder="Email"
          // additionalClasses={styles.input}
              additionalClasses={`${styles['input']} ${styles['invitation-input']}`}
       
          onChange={(e) => setInviteEmail(e.target.value)}
        />

        <div className={styles["role-select-wrapper"]}>
          <Select
            options={mappedRoles}
            onChange={(selected) => setInviteRole(selected)}
            placeholder={"Select role"}
            styleType="regular"
            value={inviteRole}
          />
        </div>
        <Button
          className={`${styles.button} container primary teamInviteBtn`}
          text="Send invitation"
          type="submit"
          disabled={!inviteEmail || !inviteRole}
        />
      </form>
    </div>
  );
};

export default TeamInviteForm;
