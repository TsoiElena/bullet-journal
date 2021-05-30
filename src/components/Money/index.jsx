import React, {useEffect, useState} from 'react';
import styles from "./style.module.scss";
import {DatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import ruLocale from "date-fns/locale/ru";
import {Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import api from "../../api";
import PlanPay from "./PlanPay";
import UnplanPay from "./unplanPay";
import Modal from "./Modal";
import DayModal from './Modal/Day'


const Money = ({user}) => {
    const [selectedDate, handleDateChange] = useState(new Date())
    const [selectedDayDate, handleDayDateChange] = useState(new Date())
    const [modalOpen, setModalOpen] = useState(false)
    const [dayOpen, setDayOpen] = useState(false)
    const [moneys, setMoneys] = useState(null)
    const [modalData, setModalData] = useState({
        balance: '',
        saved: '',
        limit: '',
        toSave: ''
    })
    const [dayData, setDayData] = useState({
        plus: '',
        minus: '',
        saved: ''
    })

    const handleMonthAdd = async (e) => {
        e.preventDefault()

        const response = await api.post('moneys/add', {
            balance: Number(modalData.balance),
            saved: Number(modalData.saved),
            limit: Number(modalData.limit),
            toSave: Number(modalData.toSave),
            date: selectedDate,
            userId: user._id
        })

        if(!response.data.data) {
            return alert(response.data.message)
        }

        setMoneys({...moneys, ...response.data.data})
        setModalData({
            balance: null,
            saved: null,
            limit: null,
            toSave: null
        })
        setModalOpen(false)
    }

    const handleDayAdd = async (e) => {
        e.preventDefault()

        const response = await api.post('moneys/day/add', {
            date: selectedDayDate,
            plus: Number(dayData.plus),
            minus: Number(dayData.minus),
            saved: Number(dayData.saved),
            moneyId: moneys._id
        })

        if(!response.data.data) {
            return alert(response.data.message)
        }

        setMoneys({...moneys, ...response.data.data})
        setDayData({
            plus: '',
            minus: '',
            saved: ''
        })
        setDayOpen(false)
    }

    const getMoneyPlan = async () => {
        const response = await api.post(`moneys/${user._id}`, {date: selectedDate})
        setMoneys(response.data.data)
    }

    const logic = () => {
         const spented = moneys.limit - moneys.spent
        if (spented < 0) return <p className={styles.textStyle}><span>Вы привысели лимит на: </span>{spented*(-1)}</p>
        if (spented > 0) return <p className={styles.textStyle}><span>Вы сэкономили: </span>{spented}</p>
    }

    useEffect(() => {
        getMoneyPlan()
    }, [selectedDate])

    const compareDates = (a, b) => {
        const dateA = new Date(a.date)
        const dateB = new Date(b.date)
        if (dateA.getDate() > dateB.getDate()) {
            return 1
        }
        return -1
    }

    return (
        <div className={styles.moneyWrapper}>
            <div className={styles.planMonth}>
                <div className={`${styles.plan} ${styles.InfoBlocks}`}>
                    <h3>Кошелек</h3>
                    <p className={styles.textStyle}>Баланс: {moneys && moneys? <span>{moneys.balance}</span> : <span>нет значения</span>} </p>
                    <p className={styles.textStyle}>Отложено: {moneys && moneys? <span>{moneys.saved}</span> : <span>нет значения</span>} </p>
                </div>
                <div className={`${styles.plan} ${styles.InfoBlocks}`}>
                    <h3>План на месяц</h3>
                    <p className={styles.textStyle}>Лимит: {moneys && moneys? <span>{moneys.limit}</span> : <span>нет значения</span>} </p>
                    <p className={styles.textStyle}>Отложить: {moneys && moneys? <span>{moneys.toSave}</span> : <span>нет значения</span>} </p>
                </div>
                <div className={`${styles.result} ${styles.InfoBlocks}`}>
                    <h3>Результаты за месяц</h3>
                    <p className={styles.textStyle}>Заработано: {moneys && moneys? <span>{moneys.income}</span> : <span>нет значения</span>} </p>
                    <p className={styles.textStyle}>Потрачено: {moneys && moneys? <span>{moneys.spent}</span> : <span>нет значения</span>} </p>
                    <p className={styles.textStyle}>Отложено: {moneys && moneys? <span>{moneys.savedInMonth}</span> : <span>нет значения</span>} </p>
                    {moneys && moneys? logic(): <span>error</span>}
                </div>
            </div>
            <div className={styles.list}>
                <div className={styles.listHeader}>
                    <Button variant="contained"
                            color="primary"
                            onClick={() => setModalOpen(true)}
                    >
                        <AddIcon/>
                    </Button>
                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ruLocale}>
                        <DatePicker
                            value={selectedDate}
                            onChange={handleDateChange}
                            format="MMM"
                            cancelLabel="отмена"
                            views={['month']}
                        />
                    </MuiPickersUtilsProvider>

                    <h2>Финансы</h2>

                    <Button variant="contained"
                            color="primary"
                            onClick={() => setDayOpen(true)}
                    >
                        <AddIcon/>
                    </Button>
                </div>

                <TableContainer component={Paper} className={styles.table}>
                    <Table size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Число</TableCell>
                                <TableCell>Заработано</TableCell>
                                <TableCell>Потрачено</TableCell>
                                <TableCell>Отложено</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {moneys && moneys.days && [...moneys.days].sort(compareDates).map(day => {
                                const date = new Date(day.date)
                                return (
                                    <TableRow key={day._id}>
                                        <TableCell>{date.getDate()}</TableCell>
                                        <TableCell>{day.plus}</TableCell>
                                        <TableCell>{day.minus}</TableCell>
                                        <TableCell>{day.saved}</TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>

            </div>

            <div className={styles.pay}>
                <PlanPay user={user} selectedDate={selectedDate}  moneys={moneys} setMoneys={setMoneys} />
                <UnplanPay user={user} selectedDate={selectedDate}  moneys={moneys} setMoneys={setMoneys}/>
            </div>
            <Modal data={modalData} setData={setModalData} open={modalOpen} setOpen={setModalOpen} onSubmit={handleMonthAdd}/>
            <DayModal
                data={dayData}
                setData={setDayData}
                open={dayOpen}
                setOpen={setDayOpen}
                date={selectedDayDate}
                setDate={handleDayDateChange}
                onSubmit={handleDayAdd}
            />
        </div>
    );
}

export default Money;
