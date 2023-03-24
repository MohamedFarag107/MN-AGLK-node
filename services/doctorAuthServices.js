const crypto = require('crypto');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const asyncHandler = require('express-async-handler');

const doctorModel = require('../models/doctorModel');
const ApiError = require('../utils/apiError');
const sendEmail = require('../utils/sendEmail');
const createToken = require('../utils/createToken');


// @desc     SING UP
// @route    POST   /api/v1/doctorAuths/doctorSignUp
// @access   Public
exports.doctorSingup = asyncHandler(async (req,res,next)=>{
    // 1) Create User
    const doctor = await doctorModel.create({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
    });

    // 2) Generate Token
    const token = createToken(doctor._id);

    // 4) Send response to client side
    res.status(201).json({data: doctor, token});
});



// @desc     LOG IN
// @route    POST   /api/v1/doctorAuths/doctorLogin
// @access   Public
exports.doctorLogin = asyncHandler(async (req, res, next)=>{
    // 1) check if password and email in the body
    // 2) check if user exist and password is correct
    const doctor = await doctorModel.findOne({email: req.body.email});

    if(!doctor || !(await bcrypt.compare(req.body.password, user.password))){
        return next(new ApiError('Incorrect Email Or Password', 401));
    }

    // 3) Generate Token
    const token = createToken(doctor._id);

    // 4) Send response to client side
    res.status(201).json({data: doctor, token});
});





// @desc    Forgot password
// @route   POST /api/v1/doctorAuths/doctorForgetPassword
// @access  Public
exports.doctorForgetPassword = asyncHandler(async (req, res, next)=>{
    // 1) Get User By Email
    const doctor = await doctorModel.findOne({email: req.body.email});
    if(!doctor){
        return next(new ApiError(`There Is No User With That Email ${req.body.email}`, 404));
    }

    // 2) If user exist, Generate Hash Random Reset Code (6 digits), and save it in dataBase
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedResetCode = crypto
        .createHash('sha256')
        .update(resetCode)
        .digest('hex');
    
    // Save Hashed Password Reset Code Into DataBase
    doctor.passwordResetCode = hashedResetCode;

    // Add Expiration Time For Code Reset Password (5 min)
    doctor.passwordResetExpires =Date.now() + 10*60*1000;
    doctor.passwordResetVerified = false;

    await doctor.save();

    // 3) send the reset code via email
    const messageBody = `Hi ${doctor.name.split(' ')[0]},\n We received a request to reset the password on your Doctor Account. \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n The Doctor Team`;
    console.log(messageBody);
    try{
        await sendEmail({
            email: doctor.email,
            subject: 'Your Code For Reset Password (Valid For 5 min)',
            message: messageBody,
        });
    }
    catch(err){
        doctor.passwordResetCode = undefined;
        doctor.passwordResetExpires = undefined;
        doctor.passwordResetVerified = undefined;

        await doctor.save();
        return next(new ApiError('There Is An Error In Sending Email', 500));
    }

    res.status(200).json({status: 'Success', message: 'Reset Code Send To Email'});
});



// @desc    Verify Reset Code password
// @route   POST /api/v1/doctorAuths/doctorVerifyResetCode
// @access  Public
exports.doctorVerifyPasswordResetCode = asyncHandler(async (req, res, next)=>{
    // 1) Get User Based On Reset Code
    const hashedResetCode = crypto
        .createHash('sha256')
        .update(req.body.resetCode)
        .digest('hex');
    
    const doctor = await doctorModel.findOne({
        passwordResetCode: hashedResetCode,
        passwordResetExpires: {$gt: Date.now()},
    });

    if(!doctor){
        return next(new ApiError('Reset Code Invalid Or Expired'));
    }

    // 2) Reset Code Valid
    doctor.passwordResetVerified = true;
    await doctor.save();

    res.status(200).json({status: 'Success'});
});



// @desc    Reset Code
// @route   POST /api/v1/doctorAuths/doctorResetPassword
// @access  Public
exports.doctorResetCode = asyncHandler(async (req,res,next)=>{
    // 1) Get User Based On Email
    const doctor = await doctorModel.findOne({ email: req.body.email});

    if(!doctor){
        return next(new ApiError(`There Is No User With Email ${req.body.email}`, 404));
    }

    // 2) Check If Reset Code Verified
    if(!doctor.passwordResetVerified){
        return next(new ApiError('Reset Code Not Verified', 400));
    }

    doctor.password = req.body.newPassword;
    doctor.passwordResetCode = undefined;
    doctor.passwordResetExpires = undefined;
    doctor.passwordResetVerified = undefined;

    await doctor.save();

    // 3) Generate Token
    const token = createToken(doctor._id);
    res.status(200).json({token});

});