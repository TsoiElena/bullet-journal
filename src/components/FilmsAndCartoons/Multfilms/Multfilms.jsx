import React, {useEffect, useState} from 'react';
import styles from '../style.module.scss'
import {
    Button, Checkbox,
    FormControlLabel,
    Modal,
    Paper,
    Table,
    TableBody,
    TableCell, TableContainer,
    TableHead,
    TableRow,
    TextField,
    FormControl,
    Select,
    MenuItem
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import api from "../../../api";

const Multfilms = ({user, selectedYear}) => {
    const [mults, setMults] = useState(null)
    const [modalOpen, setModalOpen] = useState(false)
    const [multAdd, setMultAdd] = useState('')

    const handleMultAdd = async (e) => {
        e.preventDefault()
        const response = await api.post('films/add', {
            title: multAdd,
            date: selectedYear,
            userId: user._id,
            type: 1
        })
        setMults([...mults, response.data.data])
        setMultAdd('')
        setModalOpen(false)
    }
    const changeMultStatus = async (filmId, filmStatus) => {
        const response = await api.patch('films/', {filmId, filmStatus})
        const {_id, isReady} = response.data.data
        const multsData = mults.map(mult => {
            if (mult._id === _id) {
                mult.isReady = isReady
            }
            return mult
        })
        setMults(multsData)
    }
    const changeMultMark = async (filmId, filmMark) => {
        const response = await api.patch('films/mark', {filmId, filmMark})
        if (!response.data.data) {
            return alert(response.data.message)
        }
        const {_id, mark} = response.data.data
        const multsData = mults.map(mult => {
            if (mult._id === _id) {
                mult.mark = mark
            }
            return mult
        })
        setMults(multsData)
    }

    const getMults = async () => {
        const response = await api.post(`films/${user._id}`, {year: selectedYear.getFullYear()})
        setMults(response.data.data.filter(film => film.type === 1))
    }

    useEffect(() => {
        getMults()
    }, [selectedYear])

    return (
        <div className={styles.list}>
            <div className={styles.listHeader}>
                <h2>Мультфильмы</h2>
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
                            <TableCell>Оценка</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {mults && mults.map(mult => (
                            <TableRow key={mult._id}>
                                <TableCell className={styles.statusCell}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={mult.isReady}
                                                onChange={e => changeMultStatus(mult._id, e.target.checked)}
                                                color="primary"
                                            />
                                        }
                                    />
                                </TableCell>
                                <TableCell>{mult.title}</TableCell>
                                <TableCell className={styles.statusCell}>
                                    <FormControl>
                                        <Select
                                            value={mult.mark}
                                            onChange={event => changeMultMark(mult._id, event.target.value)}
                                        >
                                            <MenuItem value={1}>1</MenuItem>
                                            <MenuItem value={2}>2</MenuItem>
                                            <MenuItem value={3}>3</MenuItem>
                                            <MenuItem value={4}>4</MenuItem>
                                            <MenuItem value={5}>5</MenuItem>
                                            <MenuItem value={6}>6</MenuItem>
                                            <MenuItem value={7}>7</MenuItem>
                                            <MenuItem value={8}>8</MenuItem>
                                            <MenuItem value={9}>9</MenuItem>
                                            <MenuItem value={10}>10</MenuItem>
                                        </Select>
                                    </FormControl>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                <form
                    className={styles.modalForm}
                    autoComplete="off"
                    onSubmit={handleMultAdd}
                >
                    <TextField
                        label="Добавить фильм"
                        placeholder="название"
                        required
                        value={multAdd}
                        className={styles.modalInput}
                        onChange={event => setMultAdd(event.target.value)}
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

export default Multfilms;