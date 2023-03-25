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
