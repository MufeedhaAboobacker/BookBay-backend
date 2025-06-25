import User from '../../models/User.js';
import jwt from 'jsonwebtoken';
import HttpError from '../../middlewares/httpError.js';
import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';

// Register
export const registerUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors, "Validation errors");
      return next(new HttpError("Invalid data inputs passed, please try again", 400));
    }

    const { name, email, password, role } = req.body;
    const fileData = req.file;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return next(new HttpError("User already exists", 400));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await new User({
      name,
      email,
      password: hashedPassword,
      role,
      image: fileData?.path
    }).save();

    if (!user) {
      return next(new HttpError("User not registered", 400));
    }
    
    const token = jwt.sign(
      { user_id: user._id, user_role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_TOKEN_EXPIRY }
    );

    if (!token) {
      return next(new HttpError("Token generation failed", 400));
    }

    res.status(201).json({
      status: true,
      message: "User created successfully",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
      },
      token
    });

  } catch (err) {
    console.error(err);
    return next(new HttpError("Something went wrong during registration", 500));
  }
};


// Login
export const loginUser = async (req, res,next) => {
  try {
    const errors = validationResult(req)
    
        if(!errors.isEmpty()){
          return next(new HttpError("Invalid data inputs passed, please try again", 400));
        } else {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return next(new HttpError("User not found", 404))
    } else {
      const isValidPassword = await bcrypt.compare(password, user.password)

      if(!isValidPassword){
        return next(new HttpError("Invalid credential", 400))
      } else {
        const token = jwt.sign(
            {user_id :user.id, user_role: user.role},
            process.env.JWT_SECRET,
            {expiresIn:process.env.JWT_TOKEN_EXPIRY}
        )

        if (!token){
          return next(new HttpError("Token generation failed", 400))
        } else {
          res.status(200).json({
            status: true,
            message: "Login successful",
            data: {
              _id: user._id,
              name: user.name,
              image: user.image,    
              email: user.email,
              role: user.role,
            },
            token
          });
        }
      }
    }}
  } catch (error) {
    return next(new HttpError("Something went wrong while adding book", 500));
  }
};
