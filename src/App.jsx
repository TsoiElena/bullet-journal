import React, {useState, useEffect} from 'react';
import Header from "./components/Header/Header";
import {Route, BrowserRouter, Switch} from "react-router-dom";
import Calendar from "./components/Calendar/Calendar";
import Day from "./components/Day/Day";
import Week from "./components/Week/Week";
import Month from "./components/Month/Month";
import FilmsAndCartoons from "./components/FilmsAndCartoons/FilmsAndCartoons";
import Books from "./components/Books/Books";
import BeautyAndHealth from "./components/BeautyAndHealth/BeautyAndHealth";
import Results from "./components/Results/Results";
import WelcomePage from "./components/WelcomePage/WelcomePage";
import LogIn from "./components/LogIn/LogIn";
import AuthCheck from "./components/AuthCheck";

const App = () => {
    const [user, setUser] = useState(null)

    useEffect(() => {
        const email = localStorage.getItem('email')
        if(email) {
            setUser({
                email,
                name: localStorage.getItem('name'),
                surname: localStorage.getItem('surname')
            })
        }
    }, [])

    return (
        <BrowserRouter>
            <Header user={user} setUser={setUser}/>
            <Switch>
                <Route path='/calendar'>
                    <AuthCheck user={user}><Calendar/></AuthCheck>
                </Route>
                <Route path='/day'>
                    <AuthCheck user={user}><Day/></AuthCheck>
                </Route>
                <Route path='/week'>
                    <AuthCheck user={user}><Week/></AuthCheck>
                </Route>
                <Route path='/month'>
                    <AuthCheck user={user}><Month/></AuthCheck>
                </Route>
                <Route path='/films-cartoons'>
                    <AuthCheck user={user}><FilmsAndCartoons/></AuthCheck>
                </Route>
                <Route path='/books'>
                    <AuthCheck user={user}><Books/></AuthCheck>
                </Route>
                <Route path='/beauty-and-health'>
                    <AuthCheck user={user}><BeautyAndHealth/></AuthCheck>
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

    );
}

export default App;
