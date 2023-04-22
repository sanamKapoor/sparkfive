import _ from "lodash"
import styles from './creatable-select.module.css'
import update from 'immutability-helper'
import ReactCreatableSelect from 'react-select/creatable'
import { useContext } from "react";
import ReactSelect from 'react-select'
import { Utilities } from '../../../assets'

// Constants
import { ASSET_EDIT } from '../../../constants/permissions'

// Components
import Tag from '../misc/tag'
import IconClickable from '../buttons/icon-clickable'

// Contexts
import { UserContext } from '../../../context'


const CreatableSelect = ({
  title,
  addText = '',
  type = '',
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
  selectOneComponent = <></>,
  allowEdit = true,
  ignorePermission = false,
  menuPosition = 'absolute',
  sortDisplayValue = false
}) => {

  const { hasPermission } = useContext(UserContext)

  const sort = (data) => {
    if (sortDisplayValue) {
      data.map((item) => {
        item.values = _.orderBy(item.values, [item => item.name.toLowerCase()], ['asc']);
      })
      return data
    } else {
      return data
    }
  }

  const onChange = async (selected, actionMeta) => {
    if (actionMeta.action !== 'clear') {
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
        setSelectedItems(sort(update(selectedItems, { $push: [item] })))
      } else {
        setSelectedItems(sort(update(selectedItems, { $push: [{ ...item, name: item.value }] })))
      }
      onAddOperationFinished()
      return item
    } else {
      if (selectedItems.findIndex(selectedItem => item.label === selectedItem.name) === -1) {
        const newItem = { name: item.label }
        if (!isNew) newItem.id = item.value
        if (type) {
          newItem.type = type
        }
        try {
          const { data } = await asyncCreateFn(newItem)
          let stateItemsUpdate
          if (!isNew) {
            stateItemsUpdate = update(selectedItems, { $push: [newItem] })
            setSelectedItems(sort(stateItemsUpdate))
          } else {
            stateItemsUpdate = update(selectedItems, { $push: [data] })
            setSelectedItems(sort(stateItemsUpdate))
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
      setSelectedItems(sort(update(selectedItems, { $splice: [[index, 1]] })))
    } else {
      try {
        let stateItemsUpdate = update(selectedItems, { $splice: [[index, 1]] })
        setSelectedItems(sort(stateItemsUpdate))
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
        {/* {selectedItems.length > 0 && */}
          <>
            <ul className={`tags-list ${styles['tags-list']}`}>
              {(selectedItems || []).map((item, index) => (
                <li key={item.id || item.value}>
                  <Tag
                    data={item}
                    altColor={altColor}
                    tag={item.name}
                    canRemove={!isShare && allowEdit && hasPermission([ASSET_EDIT])}
                    removeFunction={() => removeItem(index, item.id)}
                  />
                </li>
              ))}
            </ul>
            <div className={styles["show-all"]}>
              Show All 21
            </div>
          </>
        {/* } */}
        {((!isShare && canAdd && hasPermission([ASSET_EDIT])) || ignorePermission) &&
          <>
            {dropdownIsActive ?
              <div className={`tag-select ${selectClass}`}>
                {creatable && <ReactCreatableSelect
                  placeholder={selectPlaceholder}
                  options={avilableItems.map(item => ({ ...item, label: item.name, value: item.id }))}
                  onChange={onChange}
                  styleType={'regular item'}
                  menuPlacement={'auto'}
                  menuPosition={menuPosition}
                  isClearable={true}
                  className="creatable-select"
                />
                }

                {!creatable && <ReactSelect
                  placeholder={selectPlaceholder}
                  options={avilableItems.map(item => ({ ...item, label: item.name, value: item.id }))}
                  onChange={onChange}
                  styleType={'regular item'}
                  menuPlacement={'auto'}
                  menuPosition={menuPosition}
                  isClearable={true}
                  className="creatable-select"
                />
                }
              </div>
              :
              <>{allowEdit && <div className={`add ${styles['select-add']}`} onClick={onAddClick}>
                <IconClickable src={Utilities.addLight} />
                <span>{addText}</span>
              </div>}</>
            }
          </>
        }
      </div>
    </>
  )
}

export default CreatableSelect
