import styles from './date-selector.module.css'
import DayPicker from 'react-day-picker'
import { format } from 'date-fns'

// Components
import ItemDropdownWrapper from '../items/item-dropdown-wrapper'

const DateSelector = ({ date, dateText = 'Select Deadline', onOptionClick, pickerIsActive, handleDateChange, includeMargin = true }) => {
  return (
    <div>
      <ItemDropdownWrapper
        data={
          date
            ? format(new Date(date), 'MMM d, yyyy')
            : dateText
        }
        overrideIcon={true}
        hasOption={true}
        optionOnClick={onOptionClick}
        styleType={!date ? false : true}
      >
        {pickerIsActive && (
          <div className={`${styles['day-picker']} ${includeMargin && styles['top-margin']}`}>
            <DayPicker
              selectedDays={date}
              disabledDays={{
                before: new Date(),
              }}
              onDayClick={(day) =>
                handleDateChange(day)
              }
            />
          </div>
        )}
      </ItemDropdownWrapper>
    </div>
  )
}

export default DateSelector