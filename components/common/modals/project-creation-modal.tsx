import { useEffect, useState } from "react";
import styles from "./project-creation-modal.module.css";

// Components
import Input from "../inputs/input";
import ChannelSelector from "../items/channel-selector";
import DateSelector from "../items/date-selector";
import Base from "./base";

const ProjectCreationModal = ({
  modalIsOpen,
  closeModal,
  initialValue = "",
  confirmCreation,
}) => {
  const [renameInput, setRenameInput] = useState("");
  const [channelInput, setChannelInput] = useState("Select Channel");
  const [dateInputActive, setDateInputActive] = useState(false);
  const [dateInput, setDateInput] = useState(undefined);

  useEffect(() => {
    if (initialValue) {
      setRenameInput(initialValue);
    }
  }, [modalIsOpen, initialValue]);

  const resetInputs = () => {
    setRenameInput("");
    setChannelInput("Select Channel");
    setDateInputActive(false);
    setDateInput(undefined);
  };

  return (
    <Base
      modalIsOpen={modalIsOpen}
      closeModal={closeModal}
      confirmText={"Create"}
      headText={`Create Project`}
      disabledConfirm={
        !renameInput || channelInput === "Select Channel" || !dateInput
      }
      confirmAction={async () => {
        confirmCreation({
          name: renameInput,
          channel: channelInput,
          publishDate: dateInput,
        });
        resetInputs();
        closeModal();
      }}
    >
      <div className={styles["input-wrapper"]}>
        <Input
          placeholder={"Enter name"}
          onChange={(e) => setRenameInput(e.target.value)}
          value={renameInput}
          styleType={"regular-short"}
        />
        <div className={styles["properties-row"]}>
          <div className={styles["channel-wrapper"]}>
            <ChannelSelector
              onLabelClick={() => {
                setDateInputActive(false);
              }}
              handleChannelChange={(option) => setChannelInput(option)}
              channel={channelInput}
            />
          </div>
          <DateSelector
            date={dateInput}
            onOptionClick={() => setDateInputActive(!dateInputActive)}
            pickerIsActive={dateInputActive}
            handleDateChange={(day) => setDateInput(day)}
            includeMargin={false}
          />
        </div>
      </div>
    </Base>
  );
};

export default ProjectCreationModal;
