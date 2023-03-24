const crypto = require('crypto');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const asyncHandler = require('express-async-handler');

const userModel = require('../models/userModel');
const ApiError = require('../utils/apiError');
const sendEmail = require('../utils/sendEmail');
const createToken = require('../utils/createToken');



// @desc     Make Sure That The User Logging Or Not 
exports.protect = asyncHandler(async(req, res, next) => {
    // 1) check if token exist, if exist get it
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new ApiError('You Are Not Login, Please Login To Access This Route', 401));
    }

    // 2) Verify Token (No Change Happens, or Expired Token)
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);


    // 3) check if user exist
    const currentUser = await userModel.findById(decoded.userId);
    if (!currentUser) {
        return next(new ApiError('The User Not Found', 401));
    };

    // 4) check if user change his password after token created
    if (currentUser.passwordChangedAt) {
        const passwordChangedTimeStamp = parseInt(currentUser.passwordChangedAt.getTime() / 1000, 10);
        // User Change Password After Token
        if (passwordChangedTimeStamp > decoded.iat) {
            return next(new ApiError('User Recently Changed His Password, Please Login Again...', 401));
        }
    }

    console.log('.......................................');
    req.user = currentUser;
    next();
});


// @desc     SING UP
// @route    POST   /api/v1/Auths/signup
// @access   Public
exports.Singup = asyncHandler(async (req,res,next)=>{
    // 1) Create User
    const user = await userModel.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    });

    // 2) Generate Token
    const token = createToken(user._id);

    // 4) Send response to client side
    res.status(201).json({data: user, token});
});


// @desc     LOG IN
// @route    POST   /api/v1/Auths/login
// @access   Public
exports.Login = asyncHandler(async (req, res, next)=>{
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
// @route   POST /api/v1/Auths/forgetPassword
// @access  Public
exports.ForgetPassword = asyncHandler(async (req, res, next)=>{
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
// @route   POST /api/v1/Auths/verifyResetCode
// @access  Public
exports.VerifyPasswordResetCode = asyncHandler(async (req, res, next)=>{
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
// @route   POST /api/v1/Auths/resetPassword
// @access  Public
exports.ResetCode = asyncHandler(async (req,res,next)=>{
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