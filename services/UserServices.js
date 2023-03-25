const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt')
const multer  = require('multer')

const ApiError = require('../utils/apiError');
const UserModel = require('../models/userModel');
const createToken = require('../utils/createToken');
const {uploadForUser} = require('../middleware/uploadImageMiddleWare');

// This middleware function will be called when the user uploads image for the user


exports.uploadUserImage = uploadForUser.single("profileImage"); 

// @desc    Image Processing
exports.resizeUserImageAndSave =  (req,res,next)=>{
    const userImageName = `user-${Date.now()}.jpeg`;
    req.body.profileImage = userImageName;
    console.log(userImageName);
    next();
};


// @desc     Get List Of Users
// @route    GET   /api/v1/users
// @access   Private
exports.getUsers = asyncHandler( async(req,res)=>{
    const page = req.query.page*1 || 1;
    const limit = req.query.limit*1 || 5;
    const skip = (page - 1) * limit;
    const users = await UserModel.find({}).skip(skip).limit(limit);
    res.status(200).json({results: users.length, page, data: users});
});



// @desc    get all therapist
// @route   GET /api/v1/users/getAllTherapist
// @access  public
exports.getAllTherapist = asyncHandler(async (req, res, next) => {
    const therapist = await UserModel.find({ type: "therapist" });
    res.status(200).json({ data: therapist });
});



// @desc     Get Specific User By Id
// @route    GET   /api/v1/users/
// @access   Private
exports.getUser = asyncHandler( async(req,res,next)=>{
    const user =await UserModel.findById(req.params.id);
    if(!user){
        return next(new ApiError(`Not Found Any User For This Id ${id}`, 404));
    }
    res.status(200).json({data: user});
});




// @desc     Create User
// @route    POST   /api/v1/users
// @access   Private
exports.createUser = asyncHandler( async (req,res)=>{
    const user = await UserModel.create(req.body);
    res.status(201).json({data: user});
});




// @desc     Update Specific User By Id
// @route    PUT   /api/v1/users
// @access   Private
exports.updateUser =  asyncHandler( async (req, res, next)=>{
    const document = await UserModel.findByIdAndUpdate( 
        req.params.id,
        req.body,
        {
            new: true
        }
    );

    if(!document){
        return next(new ApiError(`Not Found Any Result For This Id ${req.params.id}`, 404));
    }
    res.status(200).json({data: document});
});



// @desc     Update Specific User Password By Id
// @route    PUT   /api/v1/users
// @access   Private
exports.updateUserPassword = asyncHandler( async (req, res, next)=>{
    const document = await UserModel.findByIdAndUpdate( 
        req.params.id,
        {
            password: await bcrypt.hash(req.body.password, 12),
            passwordChangedAt: Date.now(),
        },
        {
            new: true
        }
    );

    if(!document){
        // res.status(404).json({msg: `Not Found Any Brand For This Id ${id}`});
        return next(new ApiError(`Not Found Any Result For This Id ${req.params.id}`, 404));
    }
    res.status(200).json({data: document});
});



// @desc     Delete Specific User
// @route    DELETE  /api/v1/users
// @access   Private
exports.deleteUser = asyncHandler(async (req,res,next)=>{
    const {id} = req.params;
    const user = await UserModel.findByIdAndDelete(id);

    if(!user){
        return next(new ApiError(`Not Found Any User For This Id ${id}`, 404));
    }
    res.status(204).json({data: user});
})


// @desc    Update logged user password
// @route   PUT /api/v1/users/updateMyPassword
// @access  Private/Protect
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
    // 1) Update user password based user payload (req.user._id)
    const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
        password: await bcrypt.hash(req.body.password, 12),
        passwordChangedAt: Date.now(),
    },
    {
        new: true,
    }
    );

    // 2) Generate token
    const token = createToken(user._id);
    res.status(200).json({ data: user, token });
});



// @desc    Update logged user data (without password, role)
// @route   PUT /api/v1/users/updateMe
// @access  Private/Protect
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
    const updatedUser = await UserModel.findByIdAndUpdate(
    req.user._id,
    req.body,
    { new: true }
    );

    res.status(200).json({ data: updatedUser });
});



// @desc     Get Logged User Data
// @route    DELETE  /api/v1/getMe
// @access   Private
exports.getLoggedUserData = asyncHandler(async (req, res, next)=>{
    req.params.id = req.user._id;
    next();
});



// @desc    Deactivate logged user
// @route   DELETE /api/v1/users/deleteMe
// @access  Private/Protect
exports.deleteLoggedUserData = asyncHandler(async (req, res, next) => {
    await UserModel.findByIdAndUpdate(req.user._id, { active: false });
    res.status(204).json({ status: 'Success' });
});