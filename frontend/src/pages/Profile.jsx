import React from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import Post from '../components/Post';
import foodPhoto from "../imgs/Food1.jpg"
import profilePicture from "../imgs/default.jpg"
import ProfilePicUpload from '../components/ProfilePic';
import getCurrentUser from '../../utils/GetCurrentUser';
import '../css/Profile.css';
import '../css/ProfilePicButton.css';
import PostForm from '../components/PostForm';



export default function Profile(){
const [posts, setPosts]= React.useState(null)
const [profile, setProfile]= React.useState(null)
const [isFollowing, setIsFollowing] = React.useState(false)
const { id } = useParams()
const user = getCurrentUser()

    React.useEffect(()=>{
        const fetchProfile = async() => {
            try{
                const response = await axios.get(`http://localhost:2501/profile/${id}`)
                setPosts(response.data.posts)
                setProfile(response.data.profile)

                const followStatus = await axios.get(`http://localhost:2501/followStatus/${id}`,{
                    withCredentials: true,
                })
                setIsFollowing(followStatus.data.isFollowing)

            }catch(err){
                console.log(err)
            }
        }
        fetchProfile()
    },[id])

    function handleFollow(){
        try{
            const response = axios.post(`http://localhost:2501/followUser/${profile._id}`,{},{
                withCredentials: true,
            })
            setIsFollowing(!isFollowing)
            console.log(response.data.message)
        }catch(error){
            console.log(error)
        }
    }

    const profilePosts = Array.isArray(posts) && posts.map((post) => (
        <Post 
        key = {post._id}
        post = {post}
        /> 
    ))

     if(!profile) return <h1>Loading...</h1> 
    return (
        <div className="profile-container">
        <div className="profile-info">
          <div className="profile-img-and-username">
            <img src={profile.profilePicture === 'default.jpg' ? profilePicture : profile.profilePicture } alt="default profile picture" className="profile-pic" />
            <span className="profile-username">{profile.userName}</span>
          </div>
          {user._id === profile._id ?
            <ProfilePicUpload />
            : 
            <button className='follow-button' onClick={handleFollow}>
              {isFollowing ? 'Unfollow' : 'Follow'}
            </button>
          }
          <div className="profile-stats">
            <span className="profile-stat">Following: {profile.following ? profile.following.length : 0}</span>
            <span className="profile-stat">Followers: {profile.followers ? profile.followers.length : 0}</span>
            <span className="profile-stat">Posts: {posts ? posts.length : 0}</span>
          </div>
        </div>
        <div className="profile-posts-container">
          {profilePosts}
        </div>
        <div className="profile-posts-form">
          <PostForm />
        </div>
      </div>
    );
  }
  