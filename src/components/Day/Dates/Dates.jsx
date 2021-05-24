import React, {useEffect, useState} from 'react';
import styles from '../style.module.scss'
import api from "../../../api";


const Dates = ({user, selectedDate}) => {
    const [events, serEvents] = useState(null)

    const getEvents = async () => {
        const response = await api.post(`events/${user._id}`, {date: selectedDate})
        serEvents(response.data.data.filter(event => event.type === 0 || event.type===1 ))
    }

    useEffect(() => {
        getEvents()
    }, [selectedDate])

    return (
                <div className={`${styles.dates} ${styles.InfoBlocks}`}>
                    <h3>События</h3>
                    <ul>
                        {events && events.map(elem => <li key={elem._id}>{elem.title}</li>)}
                    </ul>
                </div>
    );
}

export default Dates;