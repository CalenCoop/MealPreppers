import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Navbar from './components/Navbar'
import LogOut from './pages/LogOut'
import SignUp from './pages/SignUp'
import SpecificPost from './pages/SpecificPost'
import Profile from './pages/Profile'
import Following from './pages/Following'
import EditPost from './pages/EditPost'
import './css/App.css';

function App() {

  return (
    <div className="app-container">
      <div className="app-content">

    <Navbar />
     <Routes> 
      <Route path ='/home' element={<Home />}/>
      <Route path ='/login' element={<Login /> }></Route>
      <Route path ='/signup' element={<SignUp /> }></Route>
      <Route path ='/logout' element={<LogOut /> }></Route>
      <Route path ='/post/:id' element={<SpecificPost /> }></Route>
      <Route path ='/profile/:id' element={<Profile /> }></Route>
      <Route path ='/following/' element={<Following /> }></Route>
      <Route path ='/editPost/:id' element={<EditPost /> }></Route>

    </Routes>
      </div>
    </div>
  )
}

export default App
