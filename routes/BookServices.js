const express = require('express');

const router = express.Router();


const {
    getAllBooks,
    getOneBook,
    createBook,
    updateBook,
    deleteBook,
    uploadBookImage,
    uploadBookFile,
    resizeBookImage,
    resizeBookFile,
} = require('../services/BookServices');



router.route('/')
    .get(getAllBooks)
    .post(uploadBookImage, resizeBookImage , createBook);

router.route('/:id')
    .get(getOneBook)
    .put(uploadBookImage, resizeBookImage , updateBook)
    .delete(deleteBook);

module.exports = router;