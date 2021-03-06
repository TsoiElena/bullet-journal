import React from 'react';
import api from '../../api'
import {TextField, Checkbox, FormControlLabel} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import styles from './style.module.scss'
import {Redirect} from "react-router-dom";

const LogIn = ({user, setUser}) => {
    const [loginData, setLoginData] = React.useState({
        email: '',
        password: '',
        rememberMe: false
    })
    const [registrationData, setRegistrationData] = React.useState({
        name: '',
        surname: '',
        email: '',
        password: '',
        confirmedPassword: '',
        rememberMe: false
    })

    const isRegistrationFailed = registrationData.password.length < 8 || registrationData.password !== registrationData.confirmedPassword

    const setLocalStorage = ({email, _id, name, surname}) => {
        localStorage.setItem('email', email)
        localStorage.setItem('id', _id)
        localStorage.setItem('name', name)
        localStorage.setItem('surname', surname)
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        const data = {...loginData}
        delete data.rememberMe

        api.post('auth/login', data)
            .then(response => {
                setUser(response.data.data)
                if(loginData.rememberMe) {
                    setLocalStorage(response.data.data)
                }
            })
            .catch(error => alert(error.response.data.message))
    }

    const handleRegistration = async (e) => {
        e.preventDefault()
        const data = {...registrationData}
        delete data.confirmedPassword
        delete data.rememberMe

        const response = await api.post('auth/registration', data)
        setUser(response.data.data)
        if(registrationData.rememberMe) {
            setLocalStorage(response.data.data)
        }
    }

    if (user) {
        return <Redirect to='calendar'/>
    }

    return (
        <div className={styles.logwrapper}>
            <div className={styles.login}>
                <div>
                    <h3>??????????????????????</h3>
                </div>
                <form
                    className={styles.logform}
                    autoComplete="off"
                    onSubmit={handleLogin}
                >
                    <TextField
                        label="????. ??????????"
                        className={styles.loginput}
                        required
                        type="email"
                        value={loginData.email}
                        onChange={event => setLoginData({...loginData, email: event.target.value})}
                    />
                    <TextField
                        label="????????????"
                        className={styles.loginput}
                        required
                        type="password"
                        value={loginData.password}
                        onChange={event => setLoginData({...loginData, password: event.target.value})}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={loginData.rememberMe}
                                onChange={e => setLoginData({...loginData, rememberMe: e.target.checked})}
                                color="primary"
                            />
                        }
                        label="?????????????????? ????????"
                    />
                    <Button
                        variant="outlined"
                        color="primary"
                        type="submit"
                        className={styles.logbutton}
                    >
                        ??????????
                    </Button>
                </form>
            </div>

            <div className={styles.auth}>
                <div>
                    <h3>??????????????????????</h3>
                </div>
                <form
                    className={styles.authform}
                    autoComplete="off"
                    onSubmit={handleRegistration}
                >
                    <div className={styles.authinput}>
                        <TextField
                            label="??????"
                            required
                            value={registrationData.name}
                            onChange={event => setRegistrationData({...registrationData, name: event.target.value})}
                            className={styles.authinput}
                        />
                        <TextField
                            label="??????????????"
                            required
                            value={registrationData.surname}
                            onChange={event => setRegistrationData({
                                ...registrationData,
                                surname: event.target.value
                            })}
                            className={styles.authinput}
                        />
                    </div>
                    <div className={styles.authinput}>
                        <TextField
                            label="????. ??????????"
                            required
                            type="email"
                            value={registrationData.email}
                            onChange={event => setRegistrationData({
                                ...registrationData,
                                email: event.target.value
                            })}
                            className={styles.authinput}
                        />
                        <TextField
                            label="????????????"
                            required
                            value={registrationData.password}
                            onChange={event => setRegistrationData({
                                ...registrationData,
                                password: event.target.value
                            })}
                            className={styles.authinput}
                        />
                        <TextField
                            label="?????????????????????? ????????????"
                            required
                            value={registrationData.confirmedPassword}
                            onChange={event => setRegistrationData({
                                ...registrationData,
                                confirmedPassword: event.target.value
                            })}
                            className={styles.authinput}
                        />
                    </div>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={registrationData.rememberMe}
                                onChange={e => setRegistrationData({...registrationData, rememberMe: e.target.checked})}
                                color="primary"
                            />
                        }
                        label="?????????????????? ????????"
                    />
                    <Button
                        variant="outlined"
                        color="primary"
                        type="submit"
                        disabled={isRegistrationFailed}
                        className={styles.authbutton}
                    >
                        ????????????????????????????????????
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default LogIn;