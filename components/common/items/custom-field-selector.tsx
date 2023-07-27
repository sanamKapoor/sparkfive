import { ProjectType, ProjectTypeChannel } from "../../../assets";
import styles from "./channel-selector.module.css";

// Components
import Dropdown from "../inputs/dropdown";
import ItemDropdownWrapper from "../items/item-dropdown-wrapper";
import ToggleableAbsoluteWrapper from "../misc/toggleable-absolute-wrapper";

const CustomFieldSelector = ({
  onLabelClick,
  handleFieldChange,
  data = "Select field",
  options,
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
              image={
                ProjectTypeChannel["Select Channel"] ||
                ProjectType["Select Channel"]
              }
              data={data}
              hasOption={true}
              optionOnClick={onLabelClick}
              isShare={isShare}
              styleType={data === "Select field" ? false : true}
            >
              {children}
            </ItemDropdownWrapper>
          </>
        )}
        Content={() => (
          <Dropdown
            options={[...options].map((option) => ({
              label: option.name,
              onClick: () => handleFieldChange(option),
            }))}
          />
        )}
      />
    </div>
  );
};

export default CustomFieldSelector;
