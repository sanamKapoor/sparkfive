import { capitalCase } from "change-case";
import { ProjectType, ProjectTypeChannel } from "../../../assets";
import channelSocialOptions from "../../../resources/data/channels-social.json";
import projectTypeOptions from "../../../resources/data/project-types.json";
import styles from "./channel-selector.module.css";

// Components
import Dropdown from "../inputs/dropdown";
import ItemDropdownWrapper from "../items/item-dropdown-wrapper";
import ToggleableAbsoluteWrapper from "../misc/toggleable-absolute-wrapper";

const ChannelSelector = ({
  onLabelClick,
  handleChannelChange,
  channel = "Select Channel",
  isShare = false,
}) => {
  return (
    <div className={`${styles.container} ${isShare && styles.shared}`}>
      <ToggleableAbsoluteWrapper
        enabled={!isShare}
        wrapperClass="field"
        contentClass="dropdown"
        Wrapper={({ children }) => (
          <>
            <ItemDropdownWrapper
              image={ProjectTypeChannel[channel] || ProjectType[channel]}
              data={capitalCase(channel)}
              hasOption={true}
              optionOnClick={onLabelClick}
              isShare={isShare}
              styleType={channel === "Select Channel" ? false : true}
            >
              {children}
            </ItemDropdownWrapper>
          </>
        )}
        Content={() => (
          <Dropdown
            options={[...projectTypeOptions, ...channelSocialOptions]
              .filter((option) => option !== "social")
              .map((option) => ({
                label: capitalCase(option),
                onClick: () => handleChannelChange(option),
              }))}
          />
        )}
      />
    </div>
  );
};

export default ChannelSelector;
