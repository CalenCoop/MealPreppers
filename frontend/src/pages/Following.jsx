import React from 'react'
import axios from 'axios'
import Post from '../components/Post'

export default function Following(){
    const [posts, setPosts]= React.useState([])


    React.useEffect(()=>{
        const fetchPosts = async() => {
            try{
                const response = await axios.get("http://localhost:2501/following",{
                    withCredentials: true,
                })
                setPosts(response.data)

            }catch(err){
                console.log(err)
            }
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
        <div className="following-container">
        
            <h1>Following page</h1>
            {postElements}
        </div>
            
    )
}