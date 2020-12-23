import styles from './date-uploaded.module.css'
import { useState, useEffect } from 'react'
import { ItemFields, Utilities } from '../../../assets'

// Components
import DateSelector from '../../common/items/date-selector'


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

    const toggleActivePublishDate = (input) => {
        if (input === activeInput) {
            setActiveInput("")
        } else {
            setActiveInput(input)
        }
    }

    return (
        <div className={`${styles.container}`}>
            <img src={ItemFields.date} className={`${styles.icon}`} />
            <div className={styles['dates-container']}>
                <DateSelector
                    dateText={'Select Start Date'}
                    date={beginDate}
                    handleDateChange={(day) => handleStartDay(day)}
                    onOptionClick={() => toggleActivePublishDate("startDate")}
                    pickerIsActive={activeInput === 'startDate'}
                    includeMargin={false}
                    isDisabled={null}
                    additionalClasses={`${styles.calendar}`}
                />
                <DateSelector
                    dateText={'Select End Date'}
                    date={endDate}
                    handleDateChange={(day) => handleEndDay(day)}
                    onOptionClick={() => toggleActivePublishDate("endDate")}
                    pickerIsActive={activeInput === 'endDate'}
                    includeMargin={false}
                    isDisabled={null}
                    additionalClasses={`${styles.calendar}`}
                />
            </div >
        </div>

    )
}

export default DateUploaded


