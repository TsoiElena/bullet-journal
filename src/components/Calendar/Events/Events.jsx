import React, {useEffect, useState} from 'react';
import styles from '../style.module.scss'
import {TextField, Modal, Button,} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import api from "../../../api";
import DateFnsUtils from "@date-io/date-fns";
import ruLocale from "date-fns/locale/ru";
import {DatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";

const Events = ({user, selectedYear, selectedDate, handleDateChange}) => {
    const [events, serEvents] = useState(null)
    const [eventModalOpen, setEventModalOpen] = useState(false)
    const [eventAdd, setEventAdd] = useState('')

    const handleEventAdd = async (e) => {
        e.preventDefault()
        const response = await api.post('events/add', {
            title: eventAdd,
            date: selectedDate,
            userId: user._id,
            type: 1
        })
        serEvents([...events, response.data.data])
        setEventAdd('')
        setEventModalOpen(false)
    }

    const getEvents = async () => {
        const response = await api.post(`events/${user._id}`, {year: selectedYear.getFullYear()})
        serEvents(response.data.data.filter(event => event.type === 1))
    }

    const compareDates = (a, b) => {
        const dateA = new Date(a.date)
        const dateB = new Date(b.date)
        if (dateA.getMonth() > dateB.getMonth()) {
            return 1
        }
        if (dateA.getMonth() < dateB.getMonth()) {
            return -1
        }
        if (dateA.getDate() > dateB.getDate()) {
            return 1
        }
        return -1
    }

    useEffect(() => {
        getEvents()
    }, [selectedYear])

    return (
        <div className={`${styles.events} ${styles.DatesBlocks}`}>
            <div className={styles.eventsHeader}>
                <h3>События</h3>
                <Button variant="contained"
                        color="secondary"
                        onClick={() => setEventModalOpen(true)}
                >
                    <AddIcon/>
                </Button>
            </div>
            <ul>
                {events && events.sort(compareDates).map(elem => {
                        const date = new Date(elem.date)
                        return <li key={elem._id}>
                            {date.getDate()}.{date.getMonth() + 1} - {elem.title}
                        </li>
                    }
                )}
            </ul>
            <Modal open={eventModalOpen} onClose={() => setEventModalOpen(false)}>
                <form
                    className={`${styles.modalFormEvent} ${styles.modalForm}`}
                    autoComplete="off"
                    onSubmit={handleEventAdd}
                >
                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ruLocale}>
                        <DatePicker
                            value={selectedDate}
                            onChange={handleDateChange}
                            format="d MMM yyyy"
                            cancelLabel="отмена"
                        />
                    </MuiPickersUtilsProvider>
                    <div className={styles.inputButtonEvent}>
                        <TextField
                            label="Добавить событие"
                            placeholder="название"
                            required
                            value={eventAdd}
                            className={styles.modalInput}
                            onChange={event => setEventAdd(event.target.value)}
                        />
                        <Button
                            variant="outlined"
                            color="primary"
                            type="submit"
                        >
                            Добавить
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

export default Events;