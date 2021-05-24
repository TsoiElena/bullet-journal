import React, {useEffect, useState} from 'react';
import styles from '../style.module.scss'
import {TextField, Modal, Button,} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import api from "../../../api";
import DateFnsUtils from "@date-io/date-fns";
import ruLocale from "date-fns/locale/ru";
import {DatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";

const Birthdays = ({user, selectedYear, selectedDate, handleDateChange}) => {
    const [birthDays, setBirth] = useState(null)
    const [birthModalOpen, setBirthModalOpen] = useState(false)
    const [birthAdd, setBirthAdd] = useState('')

    const handleBirthAdd = async (e) => {
        e.preventDefault()
        const response = await api.post('events/add', {
            title: birthAdd,
            date: selectedDate,
            userId: user._id,
            type: 0
        })
        setBirth([...birthDays, response.data.data])
        setBirthAdd('')
        setBirthModalOpen(false)
    }

    const getBirths = async () => {
        const response = await api.post(`events/${user._id}`, {year: selectedYear.getFullYear()})
        setBirth(response.data.data.filter(event => event.type === 0))
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
        getBirths()
    }, [selectedYear])

    return (
        <div className={`${styles.birthdays} ${styles.DatesBlocks}`}>

            <div className={styles.eventsHeader}>
                <h3>Дни рождения</h3>
                <Button variant="contained"
                        color="secondary"
                        onClick={() => setBirthModalOpen(true)}
                >
                    <AddIcon/>
                </Button>
            </div>
            <ul>
                {birthDays && birthDays.sort(compareDates).map(elem => {
                        const date = new Date(elem.date)
                        return <li key={elem._id}>
                            {date.getDate() }.{date.getMonth() + 1} - {elem.title}
                        </li>
                    }
                )}
            </ul>
            <Modal open={birthModalOpen} onClose={() => setBirthModalOpen(false)}>
                <form
                    className={`${styles.modalFormEvent} ${styles.modalForm}`}
                    autoComplete="off"
                    onSubmit={handleBirthAdd}
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
                            label="Добавить день рождения"
                            placeholder="чей"
                            required
                            value={birthAdd}
                            className={styles.modalInput}
                            onChange={event => setBirthAdd(event.target.value)}
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

export default Birthdays;