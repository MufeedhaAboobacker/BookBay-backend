import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/auth/authController.js';
import { check } from 'express-validator';
import multer from 'multer';

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

router.post('/register',upload.single('image'),
    [
    check('name').notEmpty().withMessage('Name is required'),
    check('email').isEmail().withMessage('Valid email is required'),
    check('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long'),
    check('role').notEmpty().isIn(['buyer', 'seller']).withMessage('Role must be either buyer or seller'),
    check('image').optional().isString().withMessage('Image must be a string'),
  ], registerUser);

router.post('/login' ,[
    check('email').isEmail().withMessage('Please enter a valid email'),
    check('password').notEmpty().withMessage('Password is required to login'),
  ],loginUser);

export default router;
