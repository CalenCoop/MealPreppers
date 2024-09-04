const passport = require("passport");
const validator = require("validator");
const User = require("../models/User");
const bcrypt = require("bcryptjs")
const {createError} = require('../middleware/error');
const jwt = require('jsonwebtoken')

exports.register = async(req, res, next)=> {
  try{
    const hash = await bcrypt.hash(req.body.password, 10)
    
    const newUser = new User({
      userName:req.body.username, 
      email:req.body.email,
      password:hash
      })
      const savedUser = await newUser.save()

    const token = jwt.sign(
      {id: savedUser._id},
      process.env.JWT
    )

    const { password, ...info } = savedUser._doc

    res
    .cookie('access_token', token,{
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      path: '/'
    })
    .status(200)
    .json({...info})
  }catch(err){
    next(err)
  }
}

exports.login = async(req, res, next)=> {
  try{
    const user = await User.findOne({userName:req.body.username})
    if(!user) {
      const errorMessage = "User not found."
      console.log(errorMessage)
      return res.status(404).json({ message: errorMessage });
    }

      const isPasswordCorrect = await bcrypt.compare(
        req.body.password,
        user.password
      )
      if(!isPasswordCorrect) {
        const errorMessage = "Wrong Password or Username"
        console.log(errorMessage)
        return res.status(400).json({ message: errorMessage  });
      } 

        const token = jwt.sign(
          {id:user._id},
          process.env.JWT)

        const {password, ...info} = user._doc
    res
    .cookie('access_token', token,{
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      path: '/'
    })
    .status(200)
    .json({...info})
  }catch(err){
    next(err)
  }
}

exports.updateUser = async(req, res, next)=> {
  try{
    const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }
  )
  res.status(200).json(updatedUser)
  }catch(err){
    next(err)
  }
}

exports.getUser = async(req, res, next)=> {
  if(req.user){
    res.status(200).json({
      success:true,
      message:'user logged in',
      user: req.user,
    })
  }
}
exports.logout = (req, res) => {
  res.clearCookie('access_token', {
    secure: true, 
    sameSite: 'none',
  });
  res.status(200).json({ message: 'User logged out' });
};



exports.getUserinfo = async(req, res, next)=> {
  try{
    const user = await User.findById(req.params.id)
    res.status(200).json(user)
  }catch(err){
    next(err)
  }
}
