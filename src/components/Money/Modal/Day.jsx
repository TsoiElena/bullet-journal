import React from "react"
import {Button, TextField, Modal} from "@material-ui/core";
import styles from "../style.module.scss";
import DateFnsUtils from "@date-io/date-fns";
import ruLocale from "date-fns/locale/ru";
import {DatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";

const DayModal = ({data, setData, open, setOpen, onSubmit, date, setDate}) => {
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
                    label="Заработано за день"
                    placeholder="сколько"
                    required
                    value={data.plus}
                    className={styles.modalInput}
                    onChange={event => setData({...data, plus: event.target.value})}
                    inputProps={{
                        pattern: regex,
                        required: true
                    }}
                />
                <TextField
                    label="Потрачено за день"
                    placeholder="сколько"
                    required
                    value={data.minus}
                    className={styles.modalInput}
                    onChange={event => setData({...data, minus: event.target.value})}
                    inputProps={{
                        pattern: regex,
                        required: true
                    }}
                />
                <TextField
                    label="Отложено за день"
                    placeholder="сколько(если сняли деньги со счета поставьте - перед цифрой)"
                    required
                    value={data.saved}
                    className={styles.modalInput}
                    onChange={event => setData({...data, saved: event.target.value})}
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

export default DayModal