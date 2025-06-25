import { Router } from 'express';
import { userUpdateProfile,userViewProfile } from '../controllers/user/userController.js';
import userAuthCheck from '../middlewares/userAuthCheck.js';
import upload from '../middlewares/uploads.js';

const router = Router();

router.use(userAuthCheck)

router.patch('/editProfile',upload.single('image'), userUpdateProfile);
router.get('/viewProfile/',userViewProfile);

export default router;