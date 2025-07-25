import User from '../../models/User.js';
import bcrypt from 'bcrypt';
import HttpError from '../../middlewares/httpError.js';
import { validationResult } from 'express-validator';

// Get user profile 
export const userViewProfile = async (req, res, next) => {
  try {
    
    const { userId, userRole } = req.userData;

    const viewProfile = await User.findById(userId).select('-password');
   
    if (!viewProfile) {
      return next(new HttpError("User not found", 404));
    } else {
      res.status(200).json({
        status: true,
        message: "Profile fetched successfully",
        data: viewProfile
      }); 
    }
  } catch (error) {
    return next(new HttpError("Something went wrong!", 500));
  }
};

// Update user profile
export const userUpdateProfile = async (req, res, next) => {
  try {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new HttpError("Invalid data inputs passed, please try again", 400));
    }

    const { userId } = req.userData;
    const { name, email, password } = req.body;
    const fileData = req.file; 

    const user = await User.findById(userId);
    if (!user) {
      return next(new HttpError("User not found", 404));
    }

    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const updateFields = {
      name,
      email,
      password: password ? hashedPassword : user.password,
    };

    if (fileData) {
      updateFields.image = fileData.path; 
    }

    const existingUser =  await User.findOne({_id: { $ne: userId}, email: email })

     if(existingUser){

       return next(new HttpError("Email already exists", 403));
     } else {

       const updatedUser = await User.findByIdAndUpdate(userId, updateFields, { new: true }).select("-password");
   
       if (!updatedUser) {
         return next(new HttpError("Updation failed", 404));
       }
   
       res.status(200).json({
         status: true,
         message: "Profile updated successfully",
         data: {
           _id: updatedUser._id,
           name: updatedUser.name,
           email: updatedUser.email,
           role: updatedUser.role,
           image: updatedUser.image,
         }
       });
     }
  } catch (error) {
    console.error(error);
    return next(new HttpError("Something went wrong while updating the profile", 500));
  }
};

