import React, {useState} from 'react';
import styles from '../style.module.scss'
import api from "../../../api";
import AddIcon from "@material-ui/icons/Add";
import Modal from './Modal'
import {
    Button,
    Checkbox,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@material-ui/core";


const PlanPay = ({moneys, setMoneys}) => {
    const [modalOpen, setModalOpen] = useState(false)
    const [selectedDatePay, handleDatePayChange] = useState(new Date())
    const [modalData, setModalData] = useState({
        title: '',
        moneySpent: ''
    })



    const handlePayAdd = async (e) => {
        e.preventDefault()

        const response = await api.post('moneys/plan-pay/add', {
            moneyId: moneys._id,
            date: selectedDatePay,
            title: modalData.title,
            moneySpent: Number(modalData.moneySpent)
        })

        if (!response.data.data) {
            return alert(response.data.message)
        }

        setMoneys({...moneys, ...response.data.data})
        setModalData({
            title: '',
            moneySpent: ''
        })
        setModalOpen(false)
    }

    const changePlannPayStatus = async (moneyId, planPayId) => {
        const response = await api.patch('moneys/plan-pay/change', {moneyId, planPayId})
        if (!response.data.data) {
            return alert(response.data.message)
        }
        setMoneys({...moneys, ...response.data.data})
    }

    const compareDates = (a, b) => {
        const dateA = new Date(a.date)
        const dateB = new Date(b.date)
        if (dateA.getDate() > dateB.getDate()) {
            return 1
        }
        return -1
    }

    return (
        <div className={`${styles.planPay} ${styles.InfoBlocks}`}>
            <div className={styles.payHeader}>
                <h3>Обязательный платеж</h3>
                <Button variant="contained"
                        color="secondary"
                        onClick={() => setModalOpen(true)}
                >
                    <AddIcon/>
                </Button>
            </div>

            <TableContainer component={Paper} className={styles.table}>
                <Table size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Число</TableCell>
                            <TableCell>Куда</TableCell>
                            <TableCell>Сколько</TableCell>
                            <TableCell>Статус</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {moneys && moneys.planPay && [...moneys.planPay].sort(compareDates).map(money => {
                            const date = new Date(money.date)
                            return (
                                <TableRow key={money._id}>
                                    <TableCell>{date.getDate()}</TableCell>
                                    <TableCell>{money.title}</TableCell>
                                    <TableCell>{money.moneySpent}</TableCell>
                                    <TableCell className={styles.statusCell}>
                                        <Checkbox
                                            checked={money.isReady}
                                            onChange={() => changePlannPayStatus(moneys._id, money._id)}
                                            color="primary"
                                            disabled={money.isReady}
                                        />
                                    </TableCell>

                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            <Modal
                data={modalData}
                setData={setModalData}
                open={modalOpen}
                setOpen={setModalOpen}
                onSubmit={handlePayAdd}
                date={selectedDatePay}
                setDate={handleDatePayChange}
            />
        </div>
    );
}

export default PlanPay;