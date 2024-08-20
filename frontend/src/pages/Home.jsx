import React,{ useContext }from 'react'
import PostForm from '../components/PostForm'
import Post from '../components/Post';
import { useEffect } from 'react'
import axios from 'axios';
import getCurrentUser from '../../utils/GetCurrentUser';
import foodPhoto from "../imgs/Food1.jpg"
import '../css/Home.css';


export default function Home(){
    const [posts, setPosts] = React.useState([])
    const [loading, setLoading] = React.useState(false)


const user = getCurrentUser()

    React.useEffect(()=>{
        setLoading(true)
        const fetchPosts = async() => {
            try{
                const response = await axios.get("http://localhost:2501/home",{
                    withCredentials: true,
                })
                setPosts(response.data)

            }catch(err){
                console.log(err)
            }
            setLoading(false)
        }
        fetchPosts()
    },[])
   
    const postElements = Array.isArray(posts) && posts.map((post) => (
    <Post 
    key = {post._id}
    post = {post}
    /> 
))
    return (
        <div className="home-container">
            <img src={foodPhoto} alt="photo of food" className='home-banner'/>
            <h2>Explore Recipes</h2>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam eveniet in temporibus distinctio eius deserunt recusandae earum voluptatum, quos minus quaerat ad, et praesentium quasi culpa, sequi vero nobis suscipit?</p>
            <PostForm />
            <div className="posts-container">
            {postElements}
            </div>
        </div>
    )
}