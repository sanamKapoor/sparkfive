import { useState } from "react";
import styles from "./team-invite-form.module.css";

// Components
import Button from "../../../common/buttons/button";
import Input from "../../../common/inputs/input";
import Select from "../../../common/inputs/select";

const TeamInvite = ({ mappedRoles, onInviteSend }) => {
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState(undefined);

  const onSubmitForm = async (e) => {
    e.preventDefault();
    await onInviteSend(inviteEmail, inviteRole.value);
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
          additionalClasses={styles.input}
          onChange={(e) => setInviteEmail(e.target.value)}
        />
        <div className={styles["role-select-wrapper"]}>
          <Select
            options={mappedRoles}
            onChange={(selected) => setInviteRole(selected)}
            placeholder={"Select a role"}
            styleType="regular"
            value={inviteRole}
          />
        </div>
        <Button
          className={styles.button}
          text="Send invitation"
          type="submit"
          styleType="primary"
          disabled={!inviteEmail || !inviteRole}
        />
      </form>
    </div>
  );
};

export default TeamInvite;
