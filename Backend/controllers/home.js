const cloudinary = require("../middleware/cloudinary");
const mongoose = require("mongoose");
const Post = require("../models/Post");
const User = require("../models/User");

module.exports = {
    getHome: async (req, res) => {
      try{
        const posts = await Post.find().sort()
        res.status(200).json(posts)
      }catch(err){
        console.error('Error fetching posts:', err);
        res.status(500).json({ error: err.message });
      }
    },
    getProfile: async (req, res) => {
      try {
          const posts = await Post.find({user: req.params.id })
          const profile = await User.findById(req.params.id)

          res.status(200).json({posts, profile})
      } catch (err) {
        console.log(err);
      }
    },
    getfollowing: async (req,res) => {
      try{
          const user = await User.findById(req.user.id).populate('following')
        
        if(!user){
          return res.status(404).json({error: "User not found"})
        }
        const posts = await Post.find({ user: { $in: user.following } }).populate('user')
        res.status(200).json(posts)
        
        }
        catch(error){
          console.log(error)
          res.status(500).json({error: "Internal server error"})
      }
    },
    followUser: async (req, res) => {
      try{
          const userId = req.params.id
          
          if(userId.toString()=== req.user.id){
            res.status(400).json({error: "You cannot follow yourself"})
            }
          const targetUser = await User.findById(userId)
          if(!targetUser){
            res.status(400).json({error:"User not found"})
          }
          
          const authUser = await User.findById(req.user.id)
          if (!authUser) {
            return res.status(400).json({ error: "Authenticated user not found" });
        }

          const isFollowing = targetUser.followers.includes(authUser.id) 
          if(isFollowing){
            //unfollow if the user clicks again
            targetUser.followers = targetUser.followers.filter((data) => data.toString() !== authUser.id.toString())
            authUser.following = authUser.following.filter((data) =>data.toString() !== targetUser.id.toString())
          }else{
            targetUser.followers.push(req.user.id)
            authUser.following.push(targetUser.id)
          }
          await targetUser.save()
          await authUser.save()

      }catch(err){
          console.log(err)
          res.status(500).json({error: 'Internal server error'})
      }
      },
      followStatus: async (req, res) => {
        try{
          const targetUser = await User.findById(req.params.id)
          if(!targetUser){
            return res.status(400).json({error: 'User not found'})
          }
          const isFollowing = targetUser.followers.includes(req.user.id)
          console.log('following?',isFollowing)
          res.status(200).json({ isFollowing })

        }catch(error){
          console.log(error)
          res.status(400).json({error: 'Internal server error'})
        }
    },
    uploadProfilePicture: async (req, res) => {
      try{
        if(req.file){
          const result = await cloudinary.uploader.upload(req.file.path)

          const updatedUser = await User.findByIdAndUpdate(req.user.id,{
            profilePicture: result.secure_url,
            cloudinaryId: result.public_id
          })
          return res.status(200).json(updatedUser)
        }
      }catch(error){
        console.log(error)
        res.status(400).json({error: "Internal server error"})
      }
    },
  };