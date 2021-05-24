import React, {useEffect, useState} from 'react';
import styles from './style.module.scss'
import {
    Checkbox,
    FormControlLabel, Modal,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
} from "@material-ui/core";
import {DatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers"
import DateFnsUtils from "@date-io/date-fns"
import ruLocale from "date-fns/locale/ru"
import Button from "@material-ui/core/Button";
import api from "../../api";
import AddIcon from "@material-ui/icons/Add";
import Dates from "./Dates/Dates";
import Buy from "./Buy/Buy";
import Notes from "./Notes/Notes";

const Day = ({user}) => {
    const [tasks, setTasks] = useState(null)
    const [selectedDate, handleDateChange] = useState(new Date());
    const [modalOpen, setModalOpen] = useState(false)
    const [taskTitle, setTitle] = useState('')

    const handleTaskAdd = async (e) => {
        e.preventDefault()
        const response = await api.post('tasks/add', {
            title: taskTitle,
            date: selectedDate,
            userId: user._id
        })
        setTasks([...tasks, response.data.data])
        setTitle('')
        setModalOpen(false)
    }

    const getTasks = async () => {
        const response = await api.post(`tasks/${user._id}`, {date: selectedDate})
        setTasks(response.data.data.filter(task => task.type === 1 ))
    }

    const changeTaskStatus = async (taskId, taskStatus) => {
        const response = await api.patch('tasks/', {taskId, taskStatus})
        const {_id, isReady} = response.data.data
        const tasksData = tasks.map(task => {
            if(task._id === _id) {
                task.isReady = isReady
            }
            return task
        })
        setTasks(tasksData)
    }

    useEffect(() => {
        getTasks()
    }, [selectedDate])

    return (
        <div className={styles.dayWrapper}>
            <Notes user={user} selectedDate={selectedDate} />
            <div className={styles.list}>
                <div className={styles.listHeader}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ruLocale}>
                        <DatePicker
                            value={selectedDate}
                            onChange={handleDateChange}
                            format="d MMM yyyy"
                            cancelLabel="отмена"
                        />
                    </MuiPickersUtilsProvider>
                    <h2>Задачи на день</h2>
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
                            {tasks && tasks.map(task => (
                                <TableRow key={task._id}>
                                    <TableCell className={styles.statusCell}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={task.isReady}
                                                    onChange={e => changeTaskStatus(task._id, e.target.checked)}
                                                    color="primary"
                                                />
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>{task.title}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>

            <div className={styles.datesAndBuy}>
                <Dates user={user} selectedDate={selectedDate} />
                <Buy user={user} selectedDate={selectedDate}/>
            </div>
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
                        value={taskTitle}
                        className={styles.modalInput}
                        onChange={event => setTitle(event.target.value)}
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

export default Day;