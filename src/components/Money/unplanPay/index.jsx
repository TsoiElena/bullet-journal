import React, {useState} from 'react';
import styles from '../style.module.scss'
import api from "../../../api";
import AddIcon from "@material-ui/icons/Add";
import Modal from '../PlanPay/Modal'
import {
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@material-ui/core";


const UnplanPay = ({moneys, setMoneys}) => {
    const [modalOpen, setModalOpen] = useState(false)
    const [selectedDatePay, handleDatePayChange] = useState(new Date())
    const [modalData, setModalData] = useState({
        title: '',
        moneySpent: ''
    })



    const handlePayAdd = async (e) => {
        e.preventDefault()

        const response = await api.post('moneys/unplan-pay/add', {
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

    const compareDates = (a, b) => {
        const dateA = new Date(a.date)
        const dateB = new Date(b.date)
        if (dateA.getDate() > dateB.getDate()) {
            return 1
        }
        return -1
    }

    return (
        <div className={`${styles.unplanPay} ${styles.InfoBlocks}`}>
            <div className={styles.payHeader}>
                <h3>Непредвиденные траты</h3>
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
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {moneys && moneys.unplanPay && [...moneys.unplanPay].sort(compareDates).map(money => {
                            const date = new Date(money.date)
                            return (
                                <TableRow key={money._id}>
                                    <TableCell>{date.getDate()}</TableCell>
                                    <TableCell>{money.title}</TableCell>
                                    <TableCell>{money.moneySpent}</TableCell>
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

export default UnplanPay;