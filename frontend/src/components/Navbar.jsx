import  React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { IoSearch, IoMenu } from "react-icons/io5";
import getCurrentUser from "../../utils/GetCurrentUser";
import { Link } from "react-router-dom";
import '../css/Navbar.css';

export default function Navbar(){
  const [user,setUser] = React.useState(null)

  React.useEffect(()=> {
    const currentUser = getCurrentUser()
    setUser(currentUser)
  },[])
  
if(!user) return 
 return (
   <header className="navbar-container">
     <nav className="navbar">
       <NavLink to="/home" className="nav-logo">
         MealPreppers
       </NavLink>
        <ul className="nav-menu">
            <Link to ={"/home"} >Home </Link>
            <Link to ={`/profile/${user._id}`} >Profile </Link>
            <Link to ={"/following"} >Following </Link>
        </ul>
        <div className="navbar-right">
        {user !== null && 
            <span className="username">{user.userName}</span>
        }
            <NavLink to="/logout" className="nav-sign-out">
            <button className="sign-out-button" >sign out</button>
            </NavLink>
           
        </div>




       
     </nav>
     </header>
 );
};
