import React, {useEffect, useState} from 'react';
import styles from './style.module.scss'
import {
    TextField,
    Checkbox,
    Paper,
    TableContainer,
    Table,
    TableRow,
    TableBody,
    TableHead,
    Modal,
    Button,
    TableCell
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import api from "../../api";
import DateFnsUtils from "@date-io/date-fns";
import ruLocale from "date-fns/locale/ru";
import {DatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import Notes from "./Notes";
import Dates from "./Dates";


const Month = ({user}) => {
    const [tasksMonth, setTasksMonth] = useState(null)
    const [modalOpen, setModalOpen] = useState(false)
    const [selectedDate, handleDateChange] = useState(new Date());
    const [taskMonthAdd, setTaskMonthAdd] = useState('')

    const handleTaskAdd = async (e) => {
        e.preventDefault()
        const response = await api.post('tasks/add', {
            title: taskMonthAdd,
            date: selectedDate,
            userId: user._id,
            type: 3
        })
        setTasksMonth([...tasksMonth, response.data.data])
        setTaskMonthAdd('')
        setModalOpen(false)
    }

    const getTasks = async () => {
        const response = await api.post(`tasks/month/${user._id}`, {date: selectedDate})
        setTasksMonth(response.data.data.filter(task => task.type === 3))
    }

    const changeTaskStatus = async (taskId, taskStatus) => {
        const response = await api.patch('tasks/', {taskId, taskStatus})
        const {_id, isReady} = response.data.data
        const tasksData = tasksMonth.map(task => {
            if (task._id === _id) {
                task.isReady = isReady
            }
            return task
        })
        setTasksMonth(tasksData)
    }

    useEffect(() => {
        getTasks()
    }, [selectedDate])
    return (
        <div className={styles.monthWrapper}>
            <Notes user={user} selectedDate={selectedDate}/>
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
                    <h2>Задачи на месяц</h2>
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
                                <TableCell> Статус </TableCell>
                                <TableCell>Название</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tasksMonth && tasksMonth.map(task => (
                                <TableRow key={task._id}>
                                    <TableCell className={styles.statusCell}>
                                        <Checkbox
                                            checked={task.isReady}
                                            onChange={e => changeTaskStatus(task._id, e.target.checked)}
                                            color="primary"
                                        />
                                    </TableCell>
                                    <TableCell>{task.title}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            <Dates user={user} selectedDate={selectedDate}/>
            <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                <form
                    className={styles.modalForm}
                    autoComplete="off"
                    onSubmit={handleTaskAdd}
                >
                    <TextField
                        label="Добавить задачу"
                        placeholder="задача"
                        required
                        value={taskMonthAdd}
                        className={styles.modalInput}
                        onChange={event => setTaskMonthAdd(event.target.value)}
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

export default Month;