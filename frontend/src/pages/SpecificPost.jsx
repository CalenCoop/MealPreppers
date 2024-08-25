import React from 'react'
import axios from 'axios'
import getCurrentUser from '../../utils/GetCurrentUser';
import { useNavigate, useParams } from 'react-router-dom'
import { Link } from 'react-router-dom';
import { IoChevronDownCircle, IoThumbsUpOutline } from "react-icons/io5";
import { IoThumbsUpSharp } from "react-icons/io5";
import DOMPurify from 'dompurify';
import '../css/SpecificPost.css';

export default function SpecificPost(){
    const [post, setPost]= React.useState(null)
    const [likes, setLikes] = React.useState(0)
    const [isLiked, setIsLiked] = React.useState(null)
    const user = getCurrentUser()
    const { id } = useParams()
    const navigate = useNavigate()

    React.useEffect(()=>{
        const fetchPost = async() => {
            try{
                const response = await axios.get(`https://mealpreppers.onrender.com/post/${id}`)
                setPost(response.data)
            }catch(err){
                console.log(err)
            }
        }
        fetchPost()
    },[id])

    React.useEffect(()=> {
        if(post){
            setLikes(post.likes)
            setIsLiked(post.likedBy.includes(user._id))
        }
    },[post, user])

    const handleLike = async(e) => {
        try{
            const response = await axios.put(`https://mealpreppers.onrender.com/post/likePost/${post._id}`, {}, 
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
             const response = await axios.delete(`https://mealpreppers.onrender.com/post/deletePost/${post._id}`,
                 { withCredentials: true })
                 console.log(response)
             }
         }catch(error){
             console.log(error)
         }
     }


    function handleEditButton() {
        navigate(`/editPost/${post._id}`, { state: { post } });
    }

    if(!post){
        return <div className="">
            Loading...
        </div>
    }

    return (
        <div className="specific-post-container">
                <>
                    <img src={post.image} alt="Post image" className="specific-post-image" />
                    <div className="button-container">
                        {post.user === user._id && 
                            <>
                                <button className='delete-button' onClick ={handleDelete}> Delete </button>
                                <button className='edit-button' onClick={handleEditButton}> Edit </button>
                            </>
                        }
                    </div>
                    <div className="specific-post-content">
                        <h1 className="specific-post-title">{post.title}</h1>
                        <div className="specific-post-meta">
                            <div className="left-spost-stats">
                                <Link to ={`/profile/${post.user}`}><span>by <span className='username-span'> {post.userName}</span></span></Link>
                                <div className="sp-likes">
                                    <button className='like-button' onClick={handleLike}>
                                        {isLiked ? 
                                        <IoThumbsUpSharp size={20}color='orangered' /> 
                                        :<IoThumbsUpOutline size={20} color='orangered'/>}
                                    </button>
                                    <span>{post.likes}</span>
                                </div>
                            </div>
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="specific-post-comment" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.comment) }}></div>
                        <div className="specific-post-details">
                            <div className="specific-post-detail">
                                <span>Estimated Cost:</span> ${post.estimatedCost}
                            </div>
                            <div className="specific-post-detail">
                                <span>Estimated Time:</span> {post.estimatedTime} mins
                            </div>
                            <div className="specific-post-detail">
                                <span>Likes:</span> {post.likes}
                            </div>
                        </div>
                    </div>
                </>
        </div>
    );
}