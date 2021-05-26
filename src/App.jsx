import React, {useState, useEffect} from 'react';
import Header from "./components/Header/Header";
import {Route, BrowserRouter, Switch} from "react-router-dom";
import {ThemeProvider} from '@material-ui/core/styles';
import {theme} from './theme'
import Calendar from "./components/Calendar/Calendar";
import Day from "./components/Day/Day";
import Month from "./components/Month/Month";
import FilmsAndCartoons from "./components/FilmsAndCartoons/FilmsAndCartoons";
import Books from "./components/Books/Books";
import Trekers from "./components/Trekers/Trekers";
import Results from "./components/Results/Results";
import WelcomePage from "./components/WelcomePage/WelcomePage";
import LogIn from "./components/LogIn/LogIn";
import AuthCheck from "./components/AuthCheck";

const App = () => {
    const [user, setUser] = useState(null)

    useEffect(() => {
        const email = localStorage.getItem('email')
        if (email) {
            setUser({
                email,
                _id: localStorage.getItem('id'),
                name: localStorage.getItem('name'),
                surname: localStorage.getItem('surname')
            })
        }
    }, [])

    return (
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <Header user={user} setUser={setUser}/>
                <Switch>
                    <Route path='/calendar'>
                        <AuthCheck user={user}><Calendar user={user}/></AuthCheck>
                    </Route>
                    <Route path='/day'>
                        <AuthCheck user={user}><Day user={user}/></AuthCheck>
                    </Route>
                    <Route path='/month'>
                        <AuthCheck user={user}><Month user={user} /></AuthCheck>
                    </Route>
                    <Route path='/films-cartoons'>
                        <AuthCheck user={user}><FilmsAndCartoons user={user} /></AuthCheck>
                    </Route>
                    <Route path='/books'>
                        <AuthCheck user={user}><Books user={user} /></AuthCheck>
                    </Route>
                    <Route path='/trekers'>
                        <AuthCheck user={user}><Trekers user={user} /></AuthCheck>
                    </Route>
                    <Route path='/results'>
                        <AuthCheck user={user}><Results/></AuthCheck>
                    </Route>

                    <Route path='/log-in'>
                        <LogIn user={user} setUser={setUser}/>
                    </Route>
                    <Route path='/*'>
                        <WelcomePage/>
                    </Route>
                </Switch>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
