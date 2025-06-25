import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  image:{
    type:String,
  },
  password: {
    type: String,
    required: [true, 'Password required'],
  },
  role: {
    type: String,
    enum: ['buyer', 'seller'],
    required: true
  },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
