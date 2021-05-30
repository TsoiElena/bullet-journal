import React from "react"
import {Button, TextField, Modal} from "@material-ui/core";
import styles from "../../style.module.scss";
import {DatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import ruLocale from "date-fns/locale/ru";

const planPayModal = ({data, setData, open, setOpen, onSubmit, date, setDate}) => {
    const regex = "^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$"
    return (
        <Modal open={open} onClose={() => setOpen(false)}>
            <form
                className={styles.modalForm}
                autoComplete="off"
                onSubmit={onSubmit}

            >
                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ruLocale}>
                    <DatePicker
                        value={date}
                        onChange={setDate}
                        format="d MMM yyyy"
                        cancelLabel="отмена"
                    />
                </MuiPickersUtilsProvider>
                <TextField
                    label="Куда"
                    placeholder="Название"
                    required
                    value={data.title}
                    className={styles.modalInput}
                    onChange={event => setData({...data, title: event.target.value})}
                />
                <TextField
                    label="Сколько"
                    placeholder="Ведите сумму"
                    required
                    value={data.moneySpent}
                    className={styles.modalInput}
                    onChange={event => setData({...data, moneySpent: event.target.value})}
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

export default planPayModal