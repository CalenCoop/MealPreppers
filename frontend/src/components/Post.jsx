import React from 'react'
import getCurrentUser from "../../utils/GetCurrentUser";
import axios from 'axios';
import { Link } from 'react-router-dom';
import { IoThumbsUpOutline } from "react-icons/io5";
import { IoThumbsUpSharp } from "react-icons/io5";
import DOMPurify from 'dompurify';
import '../css/Post.css';


export default function Post({ post }){
    const [likes, setLikes] = React.useState(post.likes || 0)
    const [isLiked, setIsLiked] = React.useState(null)
    const user = getCurrentUser()

    React.useEffect(()=> {
        setLikes(post.likes)
        setIsLiked(post.likedBy.includes(user._id))
    },[post, user])

    // const description = `${post.comment.slice(0,50)}...`
    
    
    const description = `${stripHtmlTagsAndDecode(post.comment).slice(0, 50)}...`;

    async function handleLike(e){
        e.preventDefault()
        try{
            const response = await axios.put(`http://localhost:2501/post/likePost/${post._id}`, {}, 
            { withCredentials: true });
            setLikes(response.data.likes)
            setIsLiked(response.data.likedBy.includes(user._id))
        }catch(error){
            console.log(error)
        }

    }
    async function handleDelete(e){
       e.preventDefault()
        try{
            if(post.user === user._id){
            const response = await axios.delete(`http://localhost:2501/post/deletePost/${post._id}`,
                { withCredentials: true })
                console.log(response)
            }
        }catch(error){
            console.log(error)
        }
    }

    function stripHtmlTagsAndDecode(htmlString) {
        const strippedString = htmlString.replace(/<\/?[^>]+(>|$)/g, "");
        
        const parser = new DOMParser();
        const decodedString = parser.parseFromString(strippedString, 'text/html').body.textContent || "";
        
        return decodedString;
    }

    

    return (
        <Link to={`/post/${post._id}`} className="post-link">
            <div className="post-container">
                <img src={post.image} alt="Post image"/>
                <div className="post-info">
                    <div className="title-and-rating">
                        <h3>{post.title}</h3>
                        <div className="rating-info">
                            <button className="like-button" onClick={handleLike}>
                                {isLiked ? 
                                <IoThumbsUpSharp size={20} color='#FE4500' /> 
                                :<IoThumbsUpOutline size={20} color='#FE4500'/>}
                            </button>
                            <span>{likes}</span>
                        </div>
                    </div>
                    <p className='post-description'>{description}</p>
                    <div className="bottom-post">
                    <span className="estimated-time">{post.estimatedTime} Mins.</span>
                    {post.user === user._id && 
                    <button className='delete-button' onClick ={handleDelete}> Delete </button>
                    }
                    </div>
                </div>
            </div>
        </Link>
    )
}
