const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: { 
    type: String,
    unique: true 
  },
  email: { 
    type: String,
     unique: true 
    },
  password: {
    type: String,
    required: true
    },
  profilePicture: {
    type: String,
    default: 'default.jpg',
  },
   cloudinaryId: {
      type: String,
  },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
},
{timestamps: true}
);


module.exports = mongoose.model("User", UserSchema);
