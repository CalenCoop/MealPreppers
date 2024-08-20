const cloudinary = require("../middleware/cloudinary");
const mongoose = require("mongoose");
const Post = require("../models/Post");
const User = require("../models/User");

module.exports = {
    getPost: async (req, res) => {
        try {
          const post = await Post.findById(req.params.id);

          res.status(200).json(post)    
        } catch (err) {
          console.log(err);
        }
      },

      createPost: async (req, res) => {
        try {
          // Upload image to cloudinary
          const userInfo = await User.findById(req.user.id).lean()
          console.log('user info', userInfo)

          let newPost;  
            const result = await cloudinary.uploader.upload(req.file.path);
            newPost = await Post.create({
              title: req.body.title,
              comment: req.body.comment,
              image: result.secure_url,
              cloudinaryId: result.public_id,
              // caption: req.body.caption,
              likes: 0,
              user: req.user.id,
              userName: userInfo.userName,
              estimatedTime: req.body.estimatedTime,
              estimatedCost: req.body.estimatedCost,
            });
          console.log("Post has been added!");
        res.status(200).json(newPost)
        
        } catch (err) {
          console.log(err);
          res.status(500).json({error: err.message});
        }
      },
     
      likePost: async (req, res) => {
        try{
          const postId = req.params.id
          const userId = req.user.id

          const post = await Post.findById(postId)
          // const user = await User.findById(req.user.id)
          if(post){
            const isLiked = post.likedBy.includes(userId)
            if(isLiked){
              await Post.findOneAndUpdate(
                { _id: postId },
                { $pull: { likedBy: userId }, $inc: { likes: -1 }},
                { new: true } 
              )
            }else{
              await Post.findOneAndUpdate(
                { _id: postId },
                { $push: { likedBy: userId }, $inc: { likes: 1 }},
                { new: true } 
              )
            }
            console.log('post liked')
            res.status(200).json(post)
          } else{
            res.status(404).json({ error: "Post not found" });
            }
        }catch(error){
          console.log(error)
          res.status(500).json({error: "Internal server error"})
        }
      },
      deletePost: async (req, res) => {
        try{
        const post = await Post.findById(req.params.id)
        const userId = req.user.id       
        if (!post) {
          return res.status(404).json({ error: "Post not found" });
      }
      if (post.user.toString() !== userId) {
          return res.status(403).json({ error: "Unauthorized user error" });
      }
        //delete img from cloudinary
        await cloudinary.uploader.destroy(post.cloudinaryId)
        //delete post from db
        await Post.findByIdAndDelete(req.params.id)

        console.log('Deleted Post')
        return res.status(200).json({ message: "Post deleted successfully" });
      }catch(error){
        console.log(error)
        return res.status(500).json({error: "Internal server error"})
        }
      },
      editPost: async (req, res) => {
        try {
            const post = await Post.findById(req.params.id);
            const userId = req.user.id;
    
            if (userId !== post.user.toString()) {
                return res.status(403).json({ error: "Unauthorized user error" });
            }
            console.log('recieved data', req.body)
    
            // Check if the user edited the image
            let image = post.image;
            let cloudinaryId = post.cloudinaryId;
    
            if (req.file) {
                await cloudinary.uploader.destroy(post.cloudinaryId);
                const result = await cloudinary.uploader.upload(req.file.path);
                image = result.secure_url;
                cloudinaryId = result.public_id;
            }
    
            // Update the post
            const updateFields = {
                title: req.body.title || post.title,
                comment: req.body.comment || post.comment,
                likes: req.body.likes || post.likes,
                estimatedTime: req.body.estimatedTime || post.estimatedTime,
                estimatedCost: req.body.estimatedCost || post.estimatedCost,
                image: image,
                cloudinaryId: cloudinaryId
            };
    
            const updatedPost = await post.updateOne({ $set: updateFields });
    
            return res.status(200).json(updatedPost);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Internal server error" });
        }
    },

}