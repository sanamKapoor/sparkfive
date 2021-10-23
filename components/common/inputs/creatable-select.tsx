import styles from './creatable-select.module.css'
import update from 'immutability-helper'
import ReactCreatableSelect from 'react-select/creatable'
import ReactSelect from 'react-select'
import { Utilities } from '../../../assets'

// Components
import Tag from '../misc/tag'
import IconClickable from '../buttons/icon-clickable'

const CreatableSelect = ({
  title,
  addText,
  onAddClick,
  selectPlaceholder = '',
  avilableItems,
  setAvailableItems,
  selectedItems,
  setSelectedItems,
  onAddOperationFinished,
  onRemoveOperationFinished,
  onOperationFailedSkipped,
  isShare,
  asyncCreateFn,
  dropdownIsActive,
  altColor = '',
  isBulkEdit = false,
  canAdd = true,
  selectClass = '',
  creatable = true,
  selectOneComponent = <></>
}) => {

  const onChange = async (selected, actionMeta) => {
    if(actionMeta.action !== 'clear'){
      const newItem = await addItem(selected, actionMeta.action === 'create-option')
      if (newItem && actionMeta.action === 'create-option') {
        setAvailableItems(update(avilableItems, { $push: [newItem] }))
      }
    }
  }

  const addItem = async (item, isNew = false) => {
    if (isBulkEdit) {
      if (!item || selectedItems.findIndex(selectedItem => item.label === selectedItem.name) !== -1) return
      if (!isNew) {
        setSelectedItems(update(selectedItems, { $push: [item] }))
      } else {
        setSelectedItems(update(selectedItems, { $push: [{ ...item, name: item.value }] }))
      }
      onAddOperationFinished()
      return item
    } else {
      if (selectedItems.findIndex(selectedItem => item.label === selectedItem.name) === -1) {
        const newItem = { name: item.label }
        if (!isNew) newItem.id = item.value
        try {
          const { data } = await asyncCreateFn(newItem)
          let stateItemsUpdate
          if (!isNew) {
            stateItemsUpdate = update(selectedItems, { $push: [newItem] })
            setSelectedItems(stateItemsUpdate)
          } else {
            stateItemsUpdate = update(selectedItems, { $push: [data] })
            setSelectedItems(stateItemsUpdate)
            setAvailableItems(update(avilableItems, { $push: [data] }))
          }
          onAddOperationFinished(stateItemsUpdate)
          return data
        } catch (err) {
          // TODO: Error if failure for whatever reason
          onOperationFailedSkipped()
        }
      } else {
        onOperationFailedSkipped()
      }
    }
  }

  const removeItem = async (index, id) => {
    if (isBulkEdit) {
      setSelectedItems(update(selectedItems, { $splice: [[index, 1]] }))
    } else {
      try {
        let stateItemsUpdate = update(selectedItems, { $splice: [[index, 1]] })
        setSelectedItems(stateItemsUpdate)
        onRemoveOperationFinished(index, stateItemsUpdate, id)
      } catch (err) {
        // TODO: Error if failure for whatever reason
      }
    }
  }

  return (
    <>
      <div className={`secondary-text ${styles.field}`}>{title}</div>
      {selectOneComponent}
      <div className={'normal-text'}>
        <ul className={`tags-list ${styles['tags-list']}`}>
          {selectedItems?.map((item, index) => (
            <li key={item.id || item.value}>
              <Tag
                altColor={altColor}
                tag={item.name}
                canRemove={!isShare}
                removeFunction={() => removeItem(index, item.id)}
              />
            </li>
          ))}
        </ul>
        {!isShare && canAdd &&
          <>
            {dropdownIsActive ?
              <div className={`tag-select ${selectClass}`}>
                {creatable && <ReactCreatableSelect
                    placeholder={selectPlaceholder}
                    options={avilableItems.map(item => ({...item, label: item.name, value: item.id}))}
                    onChange={onChange}
                    styleType={'regular item'}
                    menuPlacement={'top'}
                    isClearable={true}
                />
                }

                {!creatable && <ReactSelect
                  placeholder={selectPlaceholder}
                  options={avilableItems.map(item => ({ ...item, label: item.name, value: item.id }))}
                  onChange={onChange}
                  styleType={'regular item'}
                  menuPlacement={'top'}
                  isClearable={true}
                  />
                }
              </div>
              :
              <div className={`add ${styles['select-add']}`} onClick={onAddClick}>
                <IconClickable src={Utilities.add} />
                <span>{addText}</span>
              </div>
            }
          </>
        }
      </div>
    </>
  )
}

export default CreatableSelect
