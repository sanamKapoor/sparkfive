import React, { useState, useEffect } from 'react';
import CreatableSelect from 'react-select/creatable';
import ToggleableAbsoluteWrapper from '../../../common/misc/toggleable-absolute-wrapper';
import ItemFieldWrapper from '../../../common/items/item-field-wrapper';
import { ProjectTypeChannel, Utilities } from '../../../../assets';
import styles from './campaign-detail.module.css';
import DayPicker from 'react-day-picker';
import Dropdown from '../../../common/inputs/dropdown';
import ItemDropdownWrapper from '../../../common/items/item-dropdown-wrapper';
import CollaboratorItem from '../../../common/items/collaborator-item';
import SearchableUserList from '../../../common/user/searchable-user-list';
import channelSocialOptions from '../../../../resources/data/channels-social.json';
import projectStatus from '../../../../resources/data/project-status.json';
import ButtonIcon from '../../../common/buttons/button-icon';
import { capitalCase } from 'change-case';
import { format } from 'date-fns';

const CampaignDetail = ({
  projects = [],
  addProject,
  editFields,
  ownerId,
  removeCollaborator,
  addCollaborator,
}) => {
  const [activeInput, setActiveInput] = useState('');
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleActiveInput = (input) => {
    if (input === activeInput) setActiveInput('');
    else setActiveInput(input);
  };

  const toggleActiveInpudiveadlineDate = (input, index) => {
    if (input === activeInput && index === activeIndex) {
      setActiveInput("");
      setActiveIndex(null);
    } else {
      setActiveInput(input);
      setActiveIndex(index);
    }
  };

  const handleChannelChange = (index, value) => {
    toggleActiveInput('channel');
    editFields(index, { channel: value });
  };
  const handleStatusChange = (index, value) => {
    toggleActiveInput('status');
    editFields(index, { status: value });
  };
  const handleDeadlineDateChange = (index, value) => {
    toggleActiveInput('deadlineDate');
    editFields(index, { publishDate: value });
  };

  return (
    <div className={styles.container}>
      <h3>Projects</h3>
      <div className={styles['header-row']}>
        <div>Channel</div>
        <div>Project</div>
        <div>Deadline</div>
        {/* <div>Collaborators</div> */}
        <div>Status</div>
      </div>
      {projects.map((project, index) => {
        return (
          <div className={styles['project-row']} key={index}>
            <div>
              <ToggleableAbsoluteWrapper
                wrapperClass='field'
                contentClass='dropdown'
                Wrapper={({ children }) => (
                  <>
                    <ItemDropdownWrapper
                      image={ProjectTypeChannel[project.channel]}
                      data={capitalCase(project.channel)}
                      hasOption={true}
                      optionOnClick={() => toggleActiveInput('channel')}
                      styleType={project.channel === 'Select Channel' ? false : true}
                    >
                      {children}
                    </ItemDropdownWrapper>
                  </>
                )}
                Content={() => (
                  <Dropdown
                    options={channelSocialOptions.map((option) => ({
                      label: option,
                      onClick: () => {
                        handleChannelChange(index, option);
                      },
                    }))}
                  />
                )}
              />
            </div>
            <div>
              <input
                className={styles['input-name']}
                value={project.name}
                onChange={(e) =>
                  editFields(index, { name: e.target.value })
                }
                placeholder='Enter Project Name'
                onClick={() => toggleActiveInput('name')}
                onBlur={() => toggleActiveInput('name')}
              />
            </div>
            <div>
              <ItemDropdownWrapper
                image='/'
                data={
                  project.publishDate
                    ? format(new Date(project.publishDate), 'MMM d, yyyy')
                    : 'Select Deadline'
                }
                overrideIcon={true}
                hasOption={true}
                optionOnClick={() =>
                  toggleActiveInpudiveadlineDate("deadlineDate", index)
                }
                styleType={!project.publishDate ? false : true}
              >
                {activeInput === 'deadlineDate' && index === activeIndex && (
                  <div className={styles['day-picker']}>
                    <DayPicker
                      selectedDays={project.publishDate}
                      disabledDays={{
                        before: project.stardivate && new Date(project.stardivate),
                      }}
                      onDayClick={(day) =>
                        handleDeadlineDateChange(index, day)
                      }
                    />
                  </div>
                )}
              </ItemDropdownWrapper>
            </div>
            {/* <div>
              <ToggleableAbsoluteWrapper
                closeOnAction={false}
                Wrapper={({ children }) => (
                  <>
                    <ItemDropdownWrapper
                      image={Utilities.add}
                      data='Add Collaborators'
                      hasOption={true}
                      optionOnClick={() => toggleActiveInput('collaborators')}
                    >
                      <ul className={styles['collaborator-list']}>
                        {project.collaborators.map((collaborator) => (
                          <li key={collaborator.id}>
                            <CollaboratorItem
                              photoUrl={collaborator.profilePhoto}
                              onRemove={() =>
                                removeCollaborator(collaborator)
                              }
                            />
                          </li>
                        ))}
                      </ul>
                    </ItemDropdownWrapper>
                    <div className={styles['collaborators-dropdown']}>
                      {children}
                    </div>
                  </>
                )}
                Content={() => (
                  <SearchableUserList
                    onUserSelected={(user) => addCollaborator(index, user)}
                    filterOut={[ownerId]}
                    selectedList={project.collaborators.map(
                      (colab) => colab.id
                    )}
                  />
                )}
                wrapperClass={styles['image-wrapper']}
                contentClass={styles['user-list-wrapper']}
              />
            </div> */}
            <div>
              <ToggleableAbsoluteWrapper
                wrapperClass='field'
                contentClass='dropdown'
                Wrapper={({ children }) => (
                  <>
                    <ItemDropdownWrapper
                      image={ProjectTypeChannel[project.channel]}
                      data={capitalCase(project.status)}
                      overrideIcon={true}
                      hasOption={true}
                      optionOnClick={() => toggleActiveInput('status')}
                      styleType={project.status === 'draft' || 'scheduled' && true}
                    >
                      {children}
                    </ItemDropdownWrapper>
                  </>
                )}
                Content={() => (
                  <Dropdown
                    options={projectStatus.map((option) => ({
                      label: option,
                      onClick: () => {
                        handleStatusChange(index, option);
                      },
                    }))}
                  />
                )}
              />
            </div>
          </div>
        );
      })}
      <div className={styles['button-container']}>
        <ButtonIcon
          text='Add project'
          disabled={false}
          icon={Utilities.add}
          onClick={addProject}
          buttonType='button'
          isGray={true}
        />
      </div>
    </div>
  );
};

export default CampaignDetail;