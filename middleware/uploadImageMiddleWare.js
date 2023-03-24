const multer = require('multer');
const ApiError = require('../utils/apiError');



const multerObject = ()=>{
    const multerStorage = multer.memoryStorage();

    const multerFilter = function(req,file,cb){
        if(file.mimetype.startsWith('image')){
            cb(null, true);
        }
        else{
            cb(new ApiError("Only Images Allowed", 400), false);
        }
    }

    const upload = multer({storage: multerStorage, fileFilter: multerFilter });
    return upload;
}



exports.uploadSingleImage = (fieldName)=>
    multerObject().single(fieldName);


// exports.uploadMixOfImages = (arrayOfFields) =>
//     multerObject().fields(arrayOfFields);



// const storage = multer.diskStorage({destination: function (req, file, cb) {
//         if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
//             cb(null, 'uploads/BooksImage/')
//         } else if (file.mimetype === 'application/pdf') {
//             cb(null, 'uploads/BooksFile/')
//         } else {
//             cb({ message: 'Unsupported file format' }, false);
//         }
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.originalname)
//     }
// });

// const upload = multer({ storage: storage });
// exports.uploadSingleImage = (fieldName)=>  upload.single(fieldName);