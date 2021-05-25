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

const Books = ({user}) => {
    const [books, setBooks] = useState(null)
    const [selectedYear, handleYearChange] = useState(new Date())
    const [modalOpen, setModalOpen] = useState(false)
    const [bookAdd, setBookAdd] = useState('')
    const [authtorAdd, setAuthtorAdd] = useState('')

    const handleBookAdd = async (e) => {
        e.preventDefault()
        const response = await api.post('books/add', {
            authtor: authtorAdd,
            title: bookAdd,
            date: selectedYear,
            userId: user._id,
        })
        setBooks([...books, response.data.data])
        setBookAdd('')
        setAuthtorAdd('')
        setModalOpen(false)
    }
    const changeBookStatus = async (bookId, bookStatus) => {
        const response = await api.patch('books/', {bookId, bookStatus})
        const {_id, isReady} = response.data.data
        const booksData = books.map(book => {
            if (book._id === _id) {
                book.isReady = isReady
            }
            return book
        })
        setBooks(booksData)
    }
    const changeBookMark = async (bookId, bookMark) => {
        const response = await api.patch('books/mark', {bookId, bookMark})
        if(!response.data.data) {
            return alert(response.data.message)
        }
        const {_id, mark} = response.data.data
        const booksData = books.map(book => {
            if (book._id === _id) {
                book.mark = mark
            }
            return book
        })
        setBooks(booksData)
    }

    const getBooks = async () => {
        const response = await api.post(`books/${user._id}`, {year: selectedYear.getFullYear()})
        setBooks(response.data.data)
    }

    useEffect(() => {
        getBooks()
    }, [selectedYear])
    return (
        <div className={styles.bookWrapper}>
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
                    <h2>Книги</h2>
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
                                <TableCell> Автор </TableCell>
                                <TableCell>Название</TableCell>
                                <TableCell>Оценка</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {books && books.map(book => (
                                <TableRow key={book._id}>
                                    <TableCell className={styles.statusCell}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={book.isReady}
                                                    onChange={e => changeBookStatus(book._id, e.target.checked)}
                                                    color="primary"
                                                />
                                            }
                                        />
                                    </TableCell>
                                    <TableCell className={styles.authtorCell}>{book.authtor}</TableCell>
                                    <TableCell>{book.title}</TableCell>
                                    <TableCell className={styles.statusCell}>
                                        <FormControl>
                                            <Select
                                                value={book.mark}
                                                onChange={event => changeBookMark(book._id, event.target.value)}
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
            <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                <form
                    className={styles.modalForm}
                    autoComplete="off"
                    onSubmit={handleBookAdd}
                >
                    <TextField
                        label="Добавить автора"
                        placeholder="автор"
                        required
                        value={authtorAdd}
                        className={styles.modalInput}
                        onChange={event => setAuthtorAdd(event.target.value)}
                    />
                    <TextField
                        label="Добавить книгу"
                        placeholder="название"
                        required
                        value={bookAdd}
                        className={styles.modalInput}
                        onChange={event => setBookAdd(event.target.value)}
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

export default Books;