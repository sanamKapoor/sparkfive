import { useState, useEffect } from 'react'
import CreatableSelect from 'react-select/creatable';
import styles from './campaign-fields.module.css'
import { GeneralImg, ItemFields, Utilities } from '../../../../assets'
import DayPicker from 'react-day-picker'
import { format } from 'date-fns'
import update from 'immutability-helper'
import tagApi from '../../../../server-api/tag'

// Components
import ItemFieldWrapper from '../../../common/items/item-field-wrapper'
import Tag from '../../../common/misc/tag'
import UserPhoto from '../../../common/user/user-photo'
import ToggleableAbsoluteWrapper from '../../../common/misc/toggleable-absolute-wrapper'
import SearchableUserList from '../../../common/user/searchable-user-list'
import CollaboratorItem from '../../../common/items/collaborator-item'

const CampaignFields = ({
  owner,
  endDate,
  setEndDate,
  startDate,
  setStartDate,
  collaborators,
  setCollaborators,
  description,
  setDescription,
  addTag,
  removeTag,
  tags,
  addCollaborator,
  removeCollaborator
}) => {

  const [activeInput, setActiveInput] = useState('')

  const [inputTags, setInputTags] = useState([])

  useEffect(() => {
    getTags()
  }, [])

  const getTags = async () => {
    try {
      const { data } = await tagApi.getTags()
      setInputTags(data)
    } catch (err) {
      // TODO: Maybe show error?
    }
  }

  const toggleActiveInput = (input) => {
    if (input === activeInput)
      setActiveInput('')

    else
      setActiveInput(input)
  }

  const handleStartDayClick = (day, { selected }) => {
    setStartDate(selected ? undefined : day)
    setActiveInput('')
  }

  const handleEndDayClick = (day, { selected }) => {
    setEndDate(selected ? undefined : day)
    setActiveInput('')
  }



  const handleTagChange = async (selected, actionMeta) => {
    const newTag = await addTag(selected, actionMeta.action === 'create-option')
    if (actionMeta.action === 'create-option') {
      setInputTags(update(inputTags, { $push: [newTag] }))
    }
    toggleActiveInput('tags')
  }

  return (
    <div className='item-detail-cont'>
      <div className='field'>
        <ItemFieldWrapper
          title='Owner'
          overrideIcon={true}
          OverrideIconComp={() =>
            <UserPhoto
              photoUrl={owner.profilePhoto}
              sizePx={45} />}>
          <span>{owner?.name}</span>
        </ItemFieldWrapper>
      </div>
      <div className={`field`}>
        <ItemFieldWrapper
          title='Start Date'
          image={ItemFields.date}
          hasOption={true}
          optionOnClick={() => toggleActiveInput('startDate')}
        >
          <span>{startDate ? format(new Date(startDate), 'MMM d, yyyy') : 'No Start Date'}</span>
        </ItemFieldWrapper>
        {activeInput === 'startDate' &&
          <div className={'day-picker'}>
            <DayPicker
              selectedDays={new Date(startDate)}
              disabledDays={
                {
                  after: endDate && new Date(endDate),
                }
              }
              onDayClick={handleStartDayClick} />
          </div>
        }
      </div>

      <div className={`field`}>
        <ItemFieldWrapper
          title='End Date'
          image={ItemFields.date}
          hasOption={true}
          optionOnClick={() => toggleActiveInput('endDate')}
        >
          <span>{endDate ? format(new Date(endDate), 'MMM d, yyyy') : 'No End Date'}</span>
        </ItemFieldWrapper>
        {activeInput === 'endDate' &&
          <div className={'day-picker'}>
            <DayPicker
              selectedDays={new Date(endDate)}
              disabledDays={
                {
                  before: startDate && new Date(startDate),
                }
              }
              onDayClick={handleEndDayClick} />
          </div>
        }
      </div>


      <div className='field field-row-last'>
        <ItemFieldWrapper
          title='Collaborators'
          image={ItemFields.member}
          optionOnClick={() => toggleActiveInput('collaborators')}
        >
          <ul className={styles['collaborator-list']}>
            {collaborators.map(collaborator => (
              <li key={collaborator.id}>
                <CollaboratorItem photoUrl={collaborator.profilePhoto} onRemove={() => removeCollaborator(collaborator)} />
              </li>
            ))}
          </ul>
          <ToggleableAbsoluteWrapper
            closeOnAction={false}
            Wrapper={({ children }) =>
              <>
                <div className={'add'}>
                  <img src={Utilities.add} />
                  <span>Add Collaborator</span>
                </div>
                {children}
              </>
            }
            Content={() => <SearchableUserList
              onUserSelected={addCollaborator} filterOut={[owner.id]} selectedList={collaborators.map(colab => colab.id)} />}
            wrapperClass={styles['image-wrapper']}
            contentClass={styles['user-list-wrapper']}
          />
        </ItemFieldWrapper>
      </div>
      <div className={`field`}>
        <ItemFieldWrapper
          title='Tags'
          image={ItemFields.tag}
        >
          <ul className={'tags-list'}>
            {tags.map((tag, index) => (
              <li>
                <Tag
                  data={tag}
                  tag={tag.name}
                  canRemove={true}
                  removeFunction={() => removeTag(index)}
                />
              </li>
            ))}
          </ul>
          {activeInput === 'tags' ?
            <div className={'tag-select'}>
              <CreatableSelect
                placeholder={'Enter a new tag or select an existing one'}
                options={inputTags.map(tag => ({ label: tag.name, value: tag.id }))}
                className={`regular item`}
                onChange={handleTagChange}
                classNamePrefix='select-prefix'
              />
            </div>
            :
            <div className='add' onClick={() => toggleActiveInput('tags')}>
              <img src={Utilities.add} />
              <span>Add Tag</span>
            </div>
          }
        </ItemFieldWrapper>
      </div>
      <div className={`field pad-div`}></div>
      <div className={`field field-wide`}>
        <ItemFieldWrapper
          title='Description'
          image={ItemFields.description}
        >
          <textarea
            rows={description?.length > 0 ? Math.ceil(description.length / 50) : 1}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder='Enter Description'
            onClick={() => toggleActiveInput('description')}
            onBlur={() => toggleActiveInput('description')}
          />
        </ItemFieldWrapper>
      </div>
    </div>
  )
}

export default CampaignFields