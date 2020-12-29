import styles from './date-uploaded.module.css'
import { useState } from 'react'
import { ItemFields } from '../../../assets'
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { DateUtils } from 'react-day-picker';
import dateFnsFormat from 'date-fns/format';
import dateFnsParse from 'date-fns/parse';

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
    // https://react-day-picker.js.org/docs/input/
    // const formatDate = (date, format, locale) => {
    //     return dateFnsFormat(date, format, { locale });
    // }
    // const parseDate = (str, format, locale) => {
    //     const parsed = dateFnsParse(str, format, new Date(), { locale });
    //     if (DateUtils.isDate(parsed)) {
    //       return parsed;
    //     }
    //     return undefined;
    //   }

    // const FORMAT = 'MM/dd/yyyy';

    return (
        <div className={`${styles.container}`}>
            <img src={ItemFields.date} className={`${styles.icon}`} />
            <div className={styles['dates-container']}>
                <div>
                    <DayPickerInput
                        // formatDate={formatDate}
                        // format={FORMAT}
                        // parseDate={parseDate}
                        classNames={{
                            container: styles.input
                        }}
                        value={beginDate}
                        onDayChange={(day) => handleStartDay(day)}
                        placeholder='From (yyyy-mm-dd)'
                        dayPickerProps={{
                            className: styles.calendar
                        }}
                    />
                </div>

                <div>
                    <DayPickerInput
                        // formatDate={formatDate}
                        // format={FORMAT}
                        // parseDate={parseDate}
                        classNames={{
                            container: styles.input
                        }}
                        value={endDate}
                        onDayChange={(day) => handleEndDay(day)}
                        placeholder='To (yyyy-mm-dd)'
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


