import React, {useEffect, useState} from 'react';
import styles from '../style.module.scss'
import api from "../../../api";


const Dates = ({user, selectedDate}) => {
    const [events, serEvents] = useState(null)

    const getEvents = async () => {
        const response = await api.post(`events/month/${user._id}`, {date: selectedDate})
        serEvents(response.data.data.filter(event => event.type === 0 || event.type===1 ))
    }

    const compareDates = (a, b) => {
        const dateA = new Date(a.date)
        const dateB = new Date(b.date)
        if (dateA.getDate() > dateB.getDate()) {
            return 1
        }
        return -1
    }

    useEffect(() => {
        getEvents()
    }, [selectedDate])

    return (
                <div className={`${styles.dates} ${styles.InfoBlocks}`}>
                    <h3>События</h3>
                    <ul>
                        {events && events.sort(compareDates).map(elem => {
                            const date = new Date(elem.date)
                            return <li key={elem._id}>
                                {date.getDate()} - {elem.title}
                            </li>
                        })}
                    </ul>
                </div>
    );
}

export default Dates;