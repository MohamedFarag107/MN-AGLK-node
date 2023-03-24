const crypto = require('crypto');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const asyncHandler = require('express-async-handler');

const userModel = require('../models/userModel');
const ApiError = require('../utils/apiError');
const sendEmail = require('../utils/sendEmail');
const createToken = require('../utils/createToken');


// @desc     SING UP
// @route    POST   /api/v1/userAuths/userSignUp
// @access   Public
exports.userSingup = asyncHandler(async (req,res,next)=>{
    // 1) Create User
    const user = await userModel.create({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
    });

    // 2) Generate Token
    const token = createToken(user._id);

    // 4) Send response to client side
    res.status(201).json({data: user, token});
});


// @desc     LOG IN
// @route    POST   /api/v1/userAuths/userLogin
// @access   Public
exports.userLogin = asyncHandler(async (req, res, next)=>{
    // 1) check if password and email in the body
    // 2) check if user exist and password is correct
    const user = await userModel.findOne({email: req.body.email});

    if(!user || !(await bcrypt.compare(req.body.password, user.password))){
        return next(new ApiError('Incorrect Email Or Password', 401));
    }

    // 3) Generate Token
    const token = createToken(user._id);

    // 4) Send response to client side
    res.status(201).json({data: user, token});
});



// @desc    Forgot password
// @route   POST /api/v1/userAuths/userForgetPassword
// @access  Public
exports.userForgetPassword = asyncHandler(async (req, res, next)=>{
    // 1) Get User By Email
    const user = await userModel.findOne({email: req.body.email});
    if(!user){
        return next(new ApiError(`There Is No User With That Email ${req.body.email}`, 404));
    }

    // 2) If user exist, Generate Hash Random Reset Code (6 digits), and save it in dataBase
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedResetCode = crypto
        .createHash('sha256')
        .update(resetCode)
        .digest('hex');
    
    // Save Hashed Password Reset Code Into DataBase
    user.passwordResetCode = hashedResetCode;

    // Add Expiration Time For Code Reset Password (5 min)
    user.passwordResetExpires =Date.now() + 10*60*1000;
    user.passwordResetVerified = false;

    await user.save();

    // 3) send the reset code via email
    const messageBody = `Hi ${user.name.split(' ')[0]},\n We received a request to reset the password on your Doctor Account. \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n The Doctor Team`;
    console.log(messageBody);
    try{
        await sendEmail({
            email: user.email,
            subject: 'Your Code For Reset Password (Valid For 5 min)',
            message: messageBody,
        });
    }
    catch(err){
        user.passwordResetCode = undefined;
        user.passwordResetExpires = undefined;
        user.passwordResetVerified = undefined;

        await user.save();
        return next(new ApiError('There Is An Error In Sending Email', 500));
    }

    res.status(200).json({status: 'Success', message: 'Reset Code Send To Email'});
});



// @desc    Verify Reset Code password
// @route   POST /api/v1/userAuths/userVerifyResetCode
// @access  Public
exports.userVerifyPasswordResetCode = asyncHandler(async (req, res, next)=>{
    // 1) Get User Based On Reset Code
    const hashedResetCode = crypto
        .createHash('sha256')
        .update(req.body.resetCode)
        .digest('hex');
    
    const user = await userModel.findOne({
        passwordResetCode: hashedResetCode,
        passwordResetExpires: {$gt: Date.now()},
    });

    if(!user){
        return next(new ApiError('Reset Code Invalid Or Expired'));
    }

    // 2) Reset Code Valid
    user.passwordResetVerified = true;
    await user.save();

    res.status(200).json({status: 'Success'});
});



// @desc    Reset Code
// @route   POST /api/v1/userAuths/userResetPassword
// @access  Public
exports.userResetCode = asyncHandler(async (req,res,next)=>{
    // 1) Get User Based On Email
    const user = await userModel.findOne({ email: req.body.email});

    if(!user){
        return next(new ApiError(`There Is No User With Email ${req.body.email}`, 404));
    }

    // 2) Check If Reset Code Verified
    if(!user.passwordResetVerified){
        return next(new ApiError('Reset Code Not Verified', 400));
    }

    user.password = req.body.newPassword;
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save();

    // 3) Generate Token
    const token = createToken(user._id);
    res.status(200).json({token});

});