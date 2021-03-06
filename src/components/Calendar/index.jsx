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
    TableCell,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import api from "../../api";
import DateFnsUtils from "@date-io/date-fns";
import ruLocale from "date-fns/locale/ru";
import {DatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import Birthdays from "./Birthdays";
import Events from "./Events";

const Calendar = ({user}) => {
    const [tasks, setTasks] = useState(null)
    const [modalOpen, setModalOpen] = useState(false)
    const [selectedYear, handleYearChange] = useState(new Date());
    const [selectedDate, handleDateChange] = useState(new Date());
    const [taskAdd, setTaskAdd] = useState('')

    const handleTaskAdd = async (e) => {
        e.preventDefault()
        const response = await api.post('tasks/add', {
            title: taskAdd,
            date: selectedYear,
            userId: user._id,
            type: 0
        })
        setTasks([...tasks, response.data.data])
        setTaskAdd('')
        setModalOpen(false)
    }

    const getTasks = async () => {
        const response = await api.post(`tasks/${user._id}`, {year: selectedYear.getFullYear()})
        setTasks(response.data.data.filter(task => task.type === 0))
    }

    const changeTaskStatus = async (taskId, taskStatus) => {
        const response = await api.patch('tasks/', {taskId, taskStatus})
        const {_id, isReady} = response.data.data
        const tasksData = tasks.map(task => {
            if (task._id === _id) {
                task.isReady = isReady
            }
            return task
        })
        setTasks(tasksData)
    }

    useEffect(() => {
        getTasks()
    }, [selectedYear])

    return (
        <div className={styles.wrapper}>
            <Birthdays
                user={user}
                selectedYear={selectedYear}
                handleYearChange={handleYearChange}
                selectedDate={selectedDate}
                handleDateChange={handleDateChange}
            />
            <div className={styles.list}>
                <div className={styles.listHeader}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ruLocale}>
                        <DatePicker
                            value={selectedYear}
                            onChange={handleYearChange}
                            format="yyyy"
                            cancelLabel="????????????"
                            views={['year']}
                        />
                    </MuiPickersUtilsProvider>
                    <h2>???????????? ???? ??????</h2>
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
                                <TableCell> ???????????? </TableCell>
                                <TableCell>????????????????</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tasks && tasks.map(task => (
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
            <Events
                user={user}
                selectedYear={selectedYear}
                handleYearChange={handleYearChange}
                selectedDate={selectedDate}
                handleDateChange={handleDateChange}
            />
            <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                <form
                    className={styles.modalForm}
                    autoComplete="off"
                    onSubmit={handleTaskAdd}
                >
                    <TextField
                        label="???????????????? ????????????"
                        placeholder="????????????"
                        required
                        value={taskAdd}
                        className={styles.modalInput}
                        onChange={event => setTaskAdd(event.target.value)}
                    />
                    <Button
                        variant="outlined"
                        color="primary"
                        type="submit"
                        /*className={styles.logbutton}*/
                    >
                        ????????????????
                    </Button>
                </form>
            </Modal>
        </div>

    );
}

export default Calendar;