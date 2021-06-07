import styles from './channel-selector.module.css'
import { ProjectTypeChannel, ProjectType } from '../../../assets'

// Components
import ToggleableAbsoluteWrapper from '../misc/toggleable-absolute-wrapper'
import ItemDropdownWrapper from '../items/item-dropdown-wrapper'
import Dropdown from '../inputs/dropdown'

const CustomFieldSelector = ({ onLabelClick, handleFieldChange, data = 'Select field',  options, isShare = false }) => {
  return (
    <div className={`${styles.container} ${isShare && styles.shared}`}>
      <ToggleableAbsoluteWrapper
        enabled={!isShare}
        wrapperClass='field'
        contentClass='dropdown'
        Wrapper={({ children }) => (
          <>
            <ItemDropdownWrapper
              image={ProjectTypeChannel['Select Channel'] || ProjectType['Select Channel']}
              data={data}
              hasOption={true}
              optionOnClick={onLabelClick}
              isShare={isShare}
              styleType={data === 'Select field' ? false : true}
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
  )
}

export default CustomFieldSelector