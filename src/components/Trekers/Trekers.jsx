import React, {useEffect, useState} from 'react';
import api from "../../api";
import styles from "./style.module.scss";
import {DatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import ruLocale from "date-fns/locale/ru";
import {
    Button, Checkbox, FormControl,
    FormControlLabel, MenuItem, Modal,
    Paper, Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, TextField
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

const Trekers = ({user}) => {
    const [trekers, setTrekers] = useState(false)
    const [daysMonth, setDaysMonth] = useState([])
    const [selectedDate, handleDateChange] = useState(new Date())
    const [modalOpen, setModalOpen] = useState(false)
    const [trekerAdd, setTrekerAdd] = useState('')

    const handleTrekerAdd = async (e) => {
        e.preventDefault()
        const response = await api.post('trekers/add', {
            title: trekerAdd,
            date: selectedDate,
            userId: user._id,
            days: []
        })
        setTrekers([...trekers, response.data.data])
        setTrekerAdd('')
        setModalOpen(false)
    }

    const changeTrekerStatus = async (trekerId, date) => {
        const response = await api.patch('trekers/', {trekerId, date})
        const {changedTrekerId, newDay} = response.data.data
        const trekersData = trekers.map(treker => {
            if (treker._id === changedTrekerId) {
                treker.days.push(newDay)
            }
            return treker
        })
        setTrekers(trekersData)
    }

    const getTrekers = async () => {
        const response = await api.post(`trekers/${user._id}`, {date: selectedDate})
        setTrekers(response.data.data)
    }

    const setMonthDays = (date) => {
        setDaysMonth([])
        const day = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
        for (let i = 1; i <= day; i++) {
            setDaysMonth(prevState => [
                ...prevState, {
                    title: i,
                    date: new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i, 11, 0),
                }
            ])
        }
    }

    const isDatesEqual = (itemDate, dbDate) => {
        const date = new Date(itemDate)
        return date.getFullYear() === dbDate.getFullYear() &&
        date.getMonth() === dbDate.getMonth() && date.getDate() === dbDate.getDate()
    }

    useEffect(() => {
        getTrekers()
        setMonthDays(selectedDate)
    }, [selectedDate])

    return (
        <div className={styles.bookWrapper}>
            <div className={styles.list}>
                <div className={styles.listHeader}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ruLocale}>
                        <DatePicker
                            value={selectedDate}
                            onChange={handleDateChange}
                            format="MMM"
                            cancelLabel="отмена"
                            views={['month']}
                        />
                    </MuiPickersUtilsProvider>
                    <h2>Трекер привычек</h2>
                    <Button variant="contained"
                            color="primary"
                            onClick={() => setModalOpen(true)}
                    >
                        <AddIcon/>
                    </Button>
                </div>
                <TableContainer component={Paper} className={styles.table}>
                    <Table size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Название</TableCell>
                                {daysMonth && daysMonth.map((dayMonth, index) => (
                                    <TableCell key={index}> {dayMonth.title} </TableCell>
                                ))}

                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {trekers && trekers.map(treker => (
                                <TableRow key={treker._id}>
                                    <TableCell>{treker.title}</TableCell>
                                    {daysMonth && daysMonth.map((day, index) => (
                                        <TableCell key={index} className={styles.statusCell}>
                                            <Checkbox
                                                checked={treker.days.filter(item => isDatesEqual(item.date, day.date)).length}
                                                onChange={() => changeTrekerStatus(treker._id, day.date)}
                                                color="primary"
                                            />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                <form
                    className={styles.modalForm}
                    autoComplete="off"
                    onSubmit={handleTrekerAdd}
                >
                    <TextField
                        label="Добавить трекер"
                        placeholder="название"
                        required
                        value={trekerAdd}
                        className={styles.modalInput}
                        onChange={event => setTrekerAdd(event.target.value)}
                    />
                    <Button
                        variant="outlined"
                        color="primary"
                        type="submit"
                    >
                        Добавить
                    </Button>
                </form>
            </Modal>
        </div>

    );
}

export default Trekers;
