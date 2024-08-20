import React from 'react'
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie'


export default function LogOut(){
    const navigate = useNavigate()

    React.useEffect(()=> {
        localStorage.removeItem('currentUser')
        Cookies.remove('access_token', { path: '/'})
        console.log('cookies cleared')
        
        navigate('/login')
    },[])

    return (
        <h1>logged out</h1>
    )
}