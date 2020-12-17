import styles from './date-uploaded.module.css'
import { useState, useEffect } from 'react'
import { ItemFields, Utilities } from '../../../assets'

// Components
import DateSelector from '../../common/items/date-selector'


const DateUploaded = () => {

    const [selectedStarDate, setSelectedStartDate] = useState(null)
    const [selectedEndDate, setSelectedEndDate] = useState(null)
    const [activeInput, setActiveInput] = useState('')

    const handleStartDay = (value) => {
        toggleActiveInput('startDate')
        setSelectedStartDate(value)
    }
    const handleEndDay = (value) => {
        toggleActiveInput('endDate')
        setSelectedEndDate(value)
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
                    date={selectedStarDate}
                    handleDateChange={(day) => handleStartDay(day)}
                    onOptionClick={() => toggleActivePublishDate("startDate")}
                    pickerIsActive={activeInput === 'startDate'}
                    includeMargin={false}
                    isDisabled={null}
                    additionalClasses={`${styles.calendar}`}
                />
                <DateSelector
                    dateText={'Select End Date'}
                    date={selectedEndDate}
                    handleDateChange={(day) => handleEndDay(day)}
                    onOptionClick={() => toggleActivePublishDate("endDate")}
                    pickerIsActive={activeInput === 'endDate'}
                    includeMargin={false}
                    isDisabled={new Date(selectedStarDate)}
                    additionalClasses={`${styles.calendar}`}
                />
            </div >
        </div>

    )
}

export default DateUploaded


