const asyncHandler = require('express-async-handler')
const BookModel = require("../models/bookModel");
const ApiError = require("../utils/apiError");
const {uploadSingleImage} = require('../middleware/uploadImageMiddleWare');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');

// @desc    Upload Image
exports.uploadBookImage = uploadSingleImage('bookImage');
// exports.uploadBookFile = uploadSingleImage('bookFile');

exports.resizeBookImage = asyncHandler(async (req,res,next)=>{
    const bookImageFileName = `book-${uuidv4()}-${Date.now()}-cover.jpeg`;
        console.log(`user-${uuidv4()}-${Date.now()}.jpeg`);
    if(req.file){
        await sharp(req.file.buffer)
        .resize(600, 600)
        .toFormat('jpeg')
        .jpeg({ quality: 90})
        .toFile(`uploads/BooksImage/${bookImageFileName}`);

        // Save Image To DataBase
        req.body.bookImage = bookImageFileName;
    }

    next();
});

// exports.resizeBookFile = asyncHandler(async (req,res,next)=>{
//     const bookFileName = `book-${uuidv4()}-${Date.now()}-file.pdf`;
//     console.log(`user-${uuidv4()}-${Date.now()}.jpeg`);
//     if(req.file){
//         await sharp(req.file.buffer)
//         .toFile(`uploads/BooksFile/${bookFileName}`);

//         // Save Image To DataBase
//         req.body.bookFile = bookFileName;
//     }

//     next();
// });




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
