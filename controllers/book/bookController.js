import Book from '../../models/Book.js';
import HttpError from '../../middlewares/httpError.js'
import { validationResult } from 'express-validator';

// add book
export const addBook = async (req, res, next) => {
  try {
    const errors = validationResult(req)

    if(!errors.isEmpty()){
      return next(new HttpError("Invalid data inputs passed, please try again", 400));
    } else {

      const { title, author, price, description, category, rating, stock } = req.body;
      const { userId, userRole } = req.userData;
      const fileData = req.file.path;

      console.log(fileData,"req file")
  
      if (userRole !== "seller") {
        return next(new HttpError("You are not authorized to add books", 401));
      } else {
        
          const book = await new Book({
            title,
            author,
            price,
            description,
            category,
            rating,
            stock,
            image: fileData,
            seller: userId,
          }).save();
      
          if (!book) {
            return next(new HttpError("Failed to add book", 400));
          } else {
  
            res.status(201).json({
              status: true,
              message: "Book added successfully",
              data: book,
              file: fileData,
            });
          }
      }
    }
  } catch (error) {
    console.log(error,"rrr")
    return next(new HttpError("Something went wrong while adding book", 500));
  }
};

// list book
export const listBooks = async (req, res) => {
  try {
    const {userRole, userId} = req.userData

    let books = []

    if(userRole === "seller"){
      books = await Book.find({is_deleted: false, seller: userId})
      .populate({
        path: "seller",
        select: "name"
      });
    } else {
      books = await Book.find({is_deleted: false}).populate({
        path: "seller",
        select: "name"
      });;
    }

    res.status(200).json({ 
      status: true,
      message: "Books listed successfully",
      data: books 
    });
  } catch (error) {
    return next(new HttpError("Something went wrong while listing books", 500));
  }
};

// get book by id
export const getBookById = async (req, res) => {
  try {
    const {id} = req.params
    const {userId, userRole} = req.userData

    let book = {}

    if(userRole === "seller"){
      book = await Book.findOne({_id: id, is_deleted: false, seller: userId})
      .populate({
        path: "seller",
        select: "name"
      });;
    } else {
      book = await Book.findOne({_id: id, is_deleted: false})
      .populate({
        path: "seller",
        select: "name"
      });;
    }

    if (!book) {
     
      return next(new HttpError("Book not found", 404));
    } else {

      res.status(200).json({
         status: true, 
         message: "",
         data: book 
        });
    }
  } catch (error) {
     return next(new HttpError("Something went wrong while getting books", 500));
  }
};

// Update book
export const updateBook = async (req, res,next) => {
  try {
    const errors = validationResult(req)

    if(!errors.isEmpty()){
      return next(new HttpError("Invalid data inputs passed, please try again", 400));
    } else {
    
    const {id}= req.params;
    const {userId, userRole} = req.userData

    if (userRole !== 'seller') {
      return next(new HttpError("You are not authorized to update this book", 403));
    } else {
          const {
            title,
            author, 
            price,
            description,
            stock,
            rating,
            category
          } = req.body

          const updatedBook = await Book.findOneAndUpdate(
            {_id: id, is_deleted: false, seller: userId},
            {
              title,
              author,
              price,
              description,
              stock,
              rating,
              category,
            },
            { new: true}
          )
          
          if(!updatedBook){
            return next(new HttpError("Book Updating failed", 400));
          } else {
            res.status(200).json({ 
              status: true,
              message: 'Book updated successfully',
              data: updatedBook 
            });
          }
    }
  }
  } catch (error) {
    console.log(error,"error")
     return next(new HttpError("Something went wrong while updating book", 500));
  }
};

// Delete book
export const deleteBook = async (req, res, next) => {
  try {
    const {id} = req.params;
    const { userId, userRole } = req.userData;

    if (userRole !== 'seller') {
      return next(new HttpError("You are not authorized to delete this book", 403));
    } else {
  
      const deletedBook = await Book.findOneAndUpdate(
        { _id: id , seller:userId, is_deleted:false},
        { is_deleted: true },
        { new: true }
      );
  
      if (!deletedBook) {
        return next(new HttpError("Book could not be deleted", 500));
      }else{
          res.status(200).json({
          status: true,
          message: "Book deleted successfully",
          data: null,
        });
      }
    }
  } catch (error) {
    return next(new HttpError("Something went wrong while deleting book", 500));
  }
};



