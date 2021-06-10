import styles from './channel-selector.module.css'
import { capitalCase } from 'change-case'
import { ProjectTypeChannel, ProjectType } from '../../../assets'
import projectTypeOptions from '../../../resources/data/project-types.json'
import channelSocialOptions from '../../../resources/data/channels-social.json'

// Components
import ToggleableAbsoluteWrapper from '../misc/toggleable-absolute-wrapper'
import ItemDropdownWrapper from '../items/item-dropdown-wrapper'
import Dropdown from '../inputs/dropdown'

const ChannelSelector = ({ onLabelClick, handleChannelChange, channel = 'Select Channel', isShare = false }) => {
  return (
    <div className={`${styles.container} ${isShare && styles.shared}`}>
      <ToggleableAbsoluteWrapper
        enabled={!isShare}
        wrapperClass='field'
        contentClass='dropdown'
        Wrapper={({ children }) => (
          <>
            <ItemDropdownWrapper
              image={ProjectTypeChannel[channel] || ProjectType[channel]}
              data={capitalCase(channel)}
              hasOption={true}
              optionOnClick={onLabelClick}
              isShare={isShare}
              styleType={channel === 'Select Channel' ? false : true}
            >
              {children}
            </ItemDropdownWrapper>
          </>
        )}
        Content={() => (
          <Dropdown
            options={[...projectTypeOptions, ...channelSocialOptions].filter(option => option !== 'social').map((option) => ({
              label: capitalCase(option),
              onClick: () => handleChannelChange(option),
            }))}
          />
        )}
      />
    </div>
  )
}

export default ChannelSelector
