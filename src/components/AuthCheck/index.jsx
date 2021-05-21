import React from 'react'
import {Redirect} from "react-router-dom"

const AuthCheck = ({children, user}) => {
    if (!user) {
        return <Redirect to='/*'/>
    }
    return (
        <>{children}</>
    )
}

export default AuthCheck