import React, {useEffect, useState} from 'react';
import styles from '../style.module.scss'
import {Modal, TextField,} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import api from "../../../api";
import AddIcon from "@material-ui/icons/Add";


const Notes = ({user, selectedDate}) => {
    const [modalOpen, setModalOpen] = useState(false)
    const [notes, setNotes] = useState(null)
    const [notesAdd, setNotesAdd] = useState('')

    const handleEventAdd = async (e) => {
        e.preventDefault()
        const response = await api.post('events/add', {
            title: notesAdd,
            date: selectedDate,
            userId: user._id,
            type: 2
        })
        setNotes([...notes, response.data.data])
        setNotesAdd('')
        setModalOpen(false)
    }

    const getNotes = async () => {
        const response = await api.post(`events/${user._id}`, {date: selectedDate})
        setNotes(response.data.data.filter(event => event.type === 2 ))
    }

    useEffect(() => {
        getNotes()
    }, [selectedDate])

    return (
            <div className={`${styles.notes} ${styles.InfoBlocks}`}>
                <div className={styles.eventsHeader}>
                    <h3>Заметки</h3>
                    <Button variant="contained"
                            color="secondary"
                            onClick={() => setModalOpen(true)}
                    >
                        <AddIcon/>
                    </Button>
                </div>
                <ul>
                    {notes && notes.map(elem => {
                            return <li key={elem._id}>
                             {elem.title}
                            </li>
                        }
                    )}
                </ul>
                <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                    <form
                        className={styles.modalForm}
                        autoComplete="off"
                        onSubmit={handleEventAdd}
                    >
                        <TextField
                            label="Добавить заметку"
                            placeholder="заметка"
                            required
                            value={notesAdd}
                            className={styles.modalInput}
                            onChange={event => setNotesAdd(event.target.value)}
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

export default Notes;