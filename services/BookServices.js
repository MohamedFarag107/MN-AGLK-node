const asyncHandler = require('express-async-handler')
const BookModel = require("../models/bookModel");
const ApiError = require("../utils/apiError");
const {uploadForBook} = require('../middleware/uploadImageMiddleWare');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const multer  = require('multer')

// @desc    Upload Image


// This is the middleware function that will be called when the user uploads image and pdf for the book

exports.uploadBookData = uploadForBook.fields(
    [
        { name: 'bookImage', maxCount: 1 }, 
        { name: 'bookFile', maxCount: 1 }
    ]
    ); 

exports.saveBookData = (req, res, next)=> {
    const bookImageName = `book-${Date.now()}-cover.jpeg`;
    const bookFileName = `book-${Date.now()}-file.pdf`;
    req.body.bookImage = bookImageName;
    req.body.bookFile = bookFileName;
    console.log(bookImageName);
    console.log(bookFileName);
    console.log(req.files.bookImage[0].mimetype);
    next();
};


// @desc    Get list of Books
// @route   GET /api/v1/books
// @access  Public
exports.getAllBooks = asyncHandler( async(req,res)=>{
    const page = req.query.page*1 || 1;
    const limit = req.query.limit*1 || 5;
    const skip = (page - 1) * limit;
    const books = await BookModel.find({}).skip(skip).limit(limit);
    res.status(200).json({results: books.length, page, data: books});
});



// @desc    Get specific Book by id
// @route   Get /api/v1/books/:id
// @access  Public
exports.getOneBook = asyncHandler( async(req,res,next)=>{
    const book =await BookModel.findById(req.params.id);
    if(!book){
        return next(new ApiError(`Not Found Any Book For This Id ${id}`, 404));
    }
    res.status(200).json({data: book});
});



// @desc    Create Book
// @route   POST   /api/v1/books
// @access  Private
exports.createBook =asyncHandler( async (req,res)=>{
    const book = await BookModel.create(req.body);
    res.status(201).json({data: book});
});




// @desc    Update Specific Book
// @route   PUT    /api/v1/books/:id
// @access  Private
exports.updateBook = asyncHandler( async(req,res,next)=>{
    const book = await BookModel.findOneAndUpdate(
        req.params.id,
        req.body,
        {new: true}
    );
    if(!book){
        return next(new ApiError(`Not Found Any Book For This Id ${id}`, 404));
    }
    res.status(200).json({data: book});
});



// @desc   Delete Specific Book
// @route  DELETE  /api/v1/books/:id
// @access Private
exports.deleteBook = asyncHandler(async (req,res,next)=>{
    const {id} = req.params;
    const book = await BookModel.findByIdAndDelete(id);

    if(!book){
        return next(new ApiError(`Not Found Any Book For This Id ${id}`, 404));
    }
    res.status(204).json({data: book});
})
