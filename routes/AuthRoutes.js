const express = require('express');

const router = express.Router();

const { 
    signupValidator, 
    loginValidator 
} = require('../utils/validators/authValidators');

const {
    Singup,
    Login,
    ForgetPassword, 
    VerifyPasswordResetCode, 
    ResetCode 
} = require('../services/AuthServices');



router.route('/signup').post(signupValidator, Singup);
router.route('/login').post(loginValidator, Login);
router.route('/forgetPassword').post(ForgetPassword);
router.route('/verifyResetCode').post(VerifyPasswordResetCode);
router.route('/resetPassword').put(ResetCode);


module.exports =router;