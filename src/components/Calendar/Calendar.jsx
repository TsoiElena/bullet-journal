import React from 'react';
import styles from './Calendar.module.css'

const Calendar = () => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.calendarFirst}>
                календарь 1-6мес
            </div>
            <div className={styles.listFirst}>
                list1
            </div>
            <div className={styles.listTwo}>
                list2
            </div>
            <div className={styles.calendarTwo}>
                calendar 7-12 month
            </div>
        </div>

    );
}

export default Calendar;