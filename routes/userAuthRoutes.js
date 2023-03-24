const express = require('express');

const router = express.Router();

const { 
    signupValidator, 
    loginValidator 
} = require('../utils/validators/authValidators');

const {
    userSingup,
    userLogin,
    userForgetPassword, 
    userVerifyPasswordResetCode, 
    userResetCode 
} = require('../services/userAuthServices');



router.route('/userSignUp').post(signupValidator, userSingup);
router.route('/userLogin').post(loginValidator, userLogin);
router.route('/userForgetPassword').post(userForgetPassword);
router.route('/userVerifyResetCode').post(userVerifyPasswordResetCode);
router.route('/userResetPassword').put(userResetCode);


module.exports =router;