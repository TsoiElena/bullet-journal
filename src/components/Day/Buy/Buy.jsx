import React, {useEffect, useState} from 'react';
import styles from '../style.module.scss'
import {Checkbox, Modal, TextField,} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import api from "../../../api";
import AddIcon from "@material-ui/icons/Add";


const Buy = ({user, selectedDate}) => {
    const [buys, setBuys] = useState(null)
    const [modalOpen, setModalOpen] = useState(false)
    const [buyTitle, setTitle] = useState('')

    const handleBuyAdd = async (e) => {
        e.preventDefault()
        const response = await api.post('tasks/add', {
            title: buyTitle,
            date: selectedDate,
            userId: user._id,
            type: 2
        })
        setBuys([...buys, response.data.data])
        setTitle('')
        setModalOpen(false)
    }

    const getBuys = async () => {
        const response = await api.post(`tasks/${user._id}`, {date: selectedDate})
        setBuys(response.data.data.filter(task => task.type === 2 ))
    }

    const changeBuysStatus = async (taskId, taskStatus) => {
        const response = await api.patch('tasks/', {taskId, taskStatus})
        const {_id, isReady} = response.data.data
        const tasksData = buys.map(task => {
            if(task._id === _id) {
                task.isReady = isReady
            }
            return task
        })
        setBuys(tasksData)
    }

    useEffect(() => {
        getBuys()
    }, [selectedDate])

    return (
                <div className={`${styles.buy} ${styles.InfoBlocks}`}>
                    <div className={styles.eventsHeader}>
                        <h3>Покупки</h3>
                        <Button variant="contained"
                                color="secondary"
                                onClick={() => setModalOpen(true)}
                        >
                            <AddIcon/>
                        </Button>
                    </div>
                        {buys && buys.map(buy => (
                                            <div key={buy._id}>
                                                <p>
                                                <Checkbox
                                                    checked={buy.isReady}
                                                    onChange={e => changeBuysStatus(buy._id, e.target.checked)}
                                                    color="secondary"
                                                />
                                                 {buy.title}
                                                </p>
                                            </div>
                        ))}
                    <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                        <form
                            className={styles.modalForm}
                            autoComplete="off"
                            onSubmit={handleBuyAdd}
                        >
                            <TextField
                                label="Добавить покупка"
                                placeholder="название"
                                required
                                value={buyTitle}
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

export default Buy;