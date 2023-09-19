import { ProjectType, ProjectTypeChannel } from "../../../assets";
import styles from "./channel-selector.module.css";

// Components
import { useContext } from "react";
import { ASSET_EDIT } from "../../../constants/permissions";
import { UserContext } from "../../../context";
import Dropdown from "../inputs/dropdown";
import ItemDropdownWrapper from "../items/item-dropdown-wrapper";
import Tag from "../misc/tag";
import ToggleableAbsoluteWrapper from "../misc/toggleable-absolute-wrapper";

const CustomFieldSelector = ({
  onLabelClick,
  handleFieldChange,
  data = "Select field",
  options,
  isShare = false,
}) => {
  const { hasPermission } = useContext(UserContext);
  return (
    <div className={`${styles.container} ${isShare && styles.shared}`}>
      {!hasPermission([ASSET_EDIT]) && data !== "Select field" && (
        <Tag
          data={{ name: data }}
          altColor={""}
          tag={data}
          canRemove={false}
          removeFunction={() => {}}
        />
      )}
      {hasPermission([ASSET_EDIT]) && (
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
      )}
    </div>
  );
};

export default CustomFieldSelector;
