import styles from './date-selector.module.css'
import DayPicker from 'react-day-picker'
import { format } from 'date-fns'

// Components
import ItemDropdownWrapper from '../items/item-dropdown-wrapper'

const DateSelector = ({ date, dateText = 'Select Deadline', onOptionClick, pickerIsActive, handleDateChange, includeMargin = true, isDisabled = new Date(), additionalClasses = '' }) => {
  return (
    <div className={styles['calendar-container']}>
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
          <div className={`${styles['day-picker']} ${includeMargin && styles['top-margin']} ${additionalClasses}`}>
            <DayPicker
              selectedDays={date}
              disabledDays={{
                before: isDisabled,
                
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