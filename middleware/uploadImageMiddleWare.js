const multer = require('multer');
const ApiError = require('../utils/apiError');

// middleware function to check for uploaded file and image for the book
const storageBook = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'bookImage' && file.mimetype === 'image/jpeg') {
            cb(null, 'uploads/BooksImage/');
        }else if (file.fieldname === 'bookFile' && file.mimetype === 'application/pdf') {
            cb(null, 'uploads/BooksFile/');
        }else {
            cb({ message: 'Unsupported file format' }, false);
        }
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

exports.uploadForBook = multer({ storage: storageBook });


const storageUser = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/users/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});
exports.uploadForUser = multer({ storage: storageUser });