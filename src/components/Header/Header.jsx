import React, {useState} from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import AccountCircle from '@material-ui/icons/AccountCircle'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import style from './style.module.scss'
import {NavLink} from "react-router-dom"

const Header = ({user, setUser}) => {
    const [anchorEl, setAnchorEl] = useState(null)
    const menuItems = [
        {name: 'Календарь', route: '/calendar'},
        {name: 'День', route: '/day'},
        {name: 'Месяц', route: '/month'},
        {name: 'Фильмы/мультфильмы', route: '/films-cartoons'},
        {name: 'Книги', route: '/books'},
        {name: 'Красота и здоровье', route: '/beauty-and-health'},
        {name: 'Результаты', route: '/results'}
    ]

    const handleLogout = () => {
        setAnchorEl(null)
        setUser(null)
        localStorage.removeItem('name')
        localStorage.removeItem('email')
        localStorage.removeItem('surname')
    }

    return (
        <div className={style.header}>
            <AppBar position="static">
                <Toolbar className={style.headerContent}>
                    <Typography variant="h6">
                        Bullet journal
                    </Typography>
                    {user
                        ? <div className={style.userBlock}>
                            <Typography variant="h6">
                                {`${user.name} ${user.surname}`}
                            </Typography>
                            <IconButton onClick={(event) => setAnchorEl(event.currentTarget)} color="inherit">
                                <AccountCircle/>
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorEl)}
                                onClose={() => setAnchorEl(null)}
                            >
                                {menuItems.map(
                                    (menuItem) =>
                                        <NavLink key={menuItem.route} to={menuItem.route}
                                                 activeClassName={style.active}>
                                            <MenuItem>{menuItem.name} </MenuItem>
                                        </NavLink>
                                )}
                                <MenuItem onClick={handleLogout}>Выход</MenuItem>
                            </Menu>
                        </div>
                        : <Typography variant="h6">
                            <NavLink to='log-in'>
                                Войти
                            </NavLink>
                        </Typography>
                    }

                </Toolbar>
            </AppBar>
        </div>
    )
}
export default Header