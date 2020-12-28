import styles from './date-uploaded.module.css'
import { useState, useEffect } from 'react'
import { ItemFields, Utilities } from '../../../assets'
import DayPickerInput from 'react-day-picker/DayPickerInput';

// Components

const DateUploaded = ({ handleBeginDate, handleEndDate, beginDate, endDate }) => {

    const [activeInput, setActiveInput] = useState('')

    const handleStartDay = (value) => {
        toggleActiveInput('startDate')
        handleBeginDate(value)
    }
    const handleEndDay = (value) => {
        toggleActiveInput('endDate')
        handleEndDate(value)
    }

    const toggleActiveInput = (input) => {
        if (input === activeInput) setActiveInput('')
        else setActiveInput(input)
    }

    return (
        <div className={`${styles.container}`}>
            <img src={ItemFields.date} className={`${styles.icon}`} />
            <div className={styles['dates-container']}>
                <div>
                    <DayPickerInput
                    classNames={{
                        container: styles.input
                    }}
                        value={beginDate}
                        onDayChange={(day) => handleStartDay(day)}
                        placeholder="From (yyyy-mm-dd)"
                        dayPickerProps={{
                            className: styles.calendar
                        }}
                    />
                </div>
            
                <div>
                    <DayPickerInput
                        classNames={{
                            container: styles.input
                        }}
                        value={endDate}
                        onDayChange={(day) => handleEndDay(day)}
                        placeholder="To (yyyy-mm-dd)"
                        dayPickerProps={{
                            className: styles.calendar,
                            disabledDays: {
                                before: beginDate
                            },
                        }}
                    />
                </div>
            </div >
        </div>

    )
}

export default DateUploaded


