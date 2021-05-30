import React, {useEffect, useState} from 'react';
import styles from './style.module.scss'
import {DatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import ruLocale from "date-fns/locale/ru";
import {
    Button, Checkbox,
    Modal,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    FormControl,
    Select,
    MenuItem
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import api from "../../api";
import Multfilms from "./Multfilms";

const FilmsAndCartoons = ({user}) => {
    const [films, setFilms] = useState(null)
    const [selectedYear, handleYearChange] = useState(new Date())
    const [modalOpen, setModalOpen] = useState(false)
    const [filmAdd, setFilmAdd] = useState('')

    const handleFilmAdd = async (e) => {
        e.preventDefault()
        const response = await api.post('films/add', {
            title: filmAdd,
            date: selectedYear,
            userId: user._id,
            type: 0
        })
        setFilms([...films, response.data.data])
        setFilmAdd('')
        setModalOpen(false)
    }
    const changeFilmStatus = async (filmId, filmStatus) => {
        const response = await api.patch('films/', {filmId, filmStatus})
        const {_id, isReady} = response.data.data
        const filmsData = films.map(film => {
            if (film._id === _id) {
                film.isReady = isReady
            }
            return film
        })
        setFilms(filmsData)
    }
    const changeFilmMark = async (filmId, filmMark) => {
        const response = await api.patch('films/mark', {filmId, filmMark})
        if(!response.data.data) {
            return alert(response.data.message)
        }
        const {_id, mark} = response.data.data
        const filmsData = films.map(film => {
            if (film._id === _id) {
                film.mark = mark
            }
            return film
        })
        setFilms(filmsData)
    }

    const getFilms = async () => {
        const response = await api.post(`films/${user._id}`, {year: selectedYear.getFullYear()})
        setFilms(response.data.data.filter(film => film.type === 0))
    }

    useEffect(() => {
        getFilms()
    }, [selectedYear])

    return (
        <div className={styles.filmWrapper}>
            <div className={styles.list}>
                <div className={styles.listHeader}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ruLocale}>
                        <DatePicker
                            value={selectedYear}
                            onChange={handleYearChange}
                            format="yyyy"
                            cancelLabel="отмена"
                            views={['year']}
                        />
                    </MuiPickersUtilsProvider>
                    <h2>Фильмы</h2>
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
                            {films && films.map(film => (
                                <TableRow key={film._id}>
                                    <TableCell className={styles.statusCell}>
                                                <Checkbox
                                                    checked={film.isReady}
                                                    onChange={e => changeFilmStatus(film._id, e.target.checked)}
                                                    color="primary"
                                                />
                                    </TableCell>
                                    <TableCell>{film.title}</TableCell>
                                    <TableCell className={styles.statusCell}>
                                        <FormControl>
                                            <Select
                                                value={film.mark}
                                                onChange={event => changeFilmMark(film._id, event.target.value)}
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
            </div>
            <Multfilms user={user} selectedYear={selectedYear}/>
            <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                <form
                    className={styles.modalForm}
                    autoComplete="off"
                    onSubmit={handleFilmAdd}
                >
                    <TextField
                        label="Добавить фильм"
                        placeholder="название"
                        required
                        value={filmAdd}
                        className={styles.modalInput}
                        onChange={event => setFilmAdd(event.target.value)}
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

export default FilmsAndCartoons;