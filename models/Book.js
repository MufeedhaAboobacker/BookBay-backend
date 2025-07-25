import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type:String,
        default:null
    },
    category:{
        type:String,
        required:true,
        enum:['fiction',
        'non-fiction',
        'educational',
        'biography',
        'fantasy',
        'science-fiction',
        'romance',
        'mystery',
        'thriller',
        'self-help',
        'history',
        'philosophy',
        'children',
        'young-adult',
        'comics',
        'graphic-novels',
        'religion',
        'health',
        'business',
        'technology',
        'travel',
        'poetry',
        'cookbooks',
        'art',
        'sports',
        'language',
        'other'],
    },
    rating:{
        type:Number,
        required:true
    },
    stock:{
        type:Number,
        required:true
    },
    seller:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    is_deleted:{
        type:Boolean,
        default:false
    },
    
   },{
    timestamps:true
   });

   const Book = mongoose.model('Book', bookSchema);
   export default Book;