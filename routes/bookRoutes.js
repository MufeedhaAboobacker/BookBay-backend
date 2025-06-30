import { Router } from 'express';
import multer from 'multer';
import { check } from 'express-validator';
import {
  addBook,
  listBooks,
  getBookById,
  updateBook,
  deleteBook,
} from '../controllers/book/bookController.js';
import userAuthCheck from '../middlewares/userAuthCheck.js';
import upload from '../middlewares/uploads.js';

const router = Router();

router.use(userAuthCheck)

router.post('/add', upload.single('image'), [
  check('title').notEmpty().withMessage('Title is required'),
  check('price').notEmpty().withMessage('Price is required'),
  check('author').notEmpty().withMessage('Author is required'),
  check('description').notEmpty().withMessage('Description is required'),
  check('category').notEmpty().withMessage('Category is required'),
  check('rating').notEmpty().withMessage('Rating is required'),
  check('stock').notEmpty().withMessage('Stock is required'),
], addBook);


router.get('/', listBooks);
router.get('/:id', getBookById);

router.patch('/:id',upload.single('image'),[
  check('title').optional().notEmpty().withMessage('Title cannot be empty'),
  check('price').optional().isFloat({ gt: 0 }).withMessage('Price must be a number greater than 0'),
  check('author').optional().notEmpty().withMessage('Author cannot be empty'),
  check('description').optional().notEmpty().withMessage('Description cannot be empty'),
  check('category').optional().notEmpty().withMessage('Invalid category'),
  check('rating').optional().isFloat({ min: 0, max: 5 }).withMessage('Rating must be between 0 and 5'),
  check('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
],updateBook);

router.patch('/delete/:id', deleteBook);

export default router;
