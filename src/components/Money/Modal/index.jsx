import React from "react"
import {Button, TextField, Modal} from "@material-ui/core";
import styles from "../style.module.scss";

const MoneyModal = ({data, setData, open, setOpen, onSubmit}) => {
    const regex = "^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$"
    return (
        <Modal open={open} onClose={() => setOpen(false)}>
            <form
                className={styles.modalForm}
                autoComplete="off"
                onSubmit={onSubmit}
            >
                <TextField
                    label="Текущий баланс"
                    placeholder="сколько"
                    required
                    value={data.balance}
                    className={styles.modalInput}
                    onChange={event => setData({...data, balance: event.target.value})}
                    inputProps={{
                        pattern: regex,
                        required: true
                    }}
                />
                <TextField
                    label="Отложено в рублях"
                    placeholder="сколько"
                    required
                    value={data.saved}
                    className={styles.modalInput}
                    onChange={event => setData({...data, saved: event.target.value})}
                    inputProps={{
                        pattern: regex,
                        required: true
                    }}
                />
                <TextField
                    label="Лимит на месяц (без обязательных платежей)"
                    placeholder="сколько "
                    required
                    value={data.limit}
                    className={styles.modalInput}
                    onChange={event => setData({...data, limit: event.target.value})}
                    inputProps={{
                        pattern: regex,
                        required: true
                    }}
                />
                <TextField
                    label="Планируете отложить за месяц"
                    placeholder="сколько "
                    required
                    value={data.toSave}
                    className={styles.modalInput}
                    onChange={event => setData({...data, toSave: event.target.value})}
                    inputProps={{
                        pattern: regex,
                        required: true
                    }}
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
    )
}

export default MoneyModal