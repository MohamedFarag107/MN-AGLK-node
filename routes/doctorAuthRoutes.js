const express = require('express');

const router = express.Router();

const { 
    signupValidator, 
    loginValidator 
} = require('../utils/validators/authValidators');

const { 
    doctorSingup, 
    doctorLogin, 
    doctorForgetPassword, 
    doctorVerifyPasswordResetCode, 
    doctorResetCode 
} = require('../services/doctorAuthServices');



router.route('/doctorSignUp').post(signupValidator, doctorSingup);
router.route('/doctorLogin').post(loginValidator, doctorLogin);
router.route('/doctorForgetPassword').post(doctorForgetPassword);
router.route('/doctorVerifyResetCode').post(doctorVerifyPasswordResetCode);
router.route('/doctorResetPassword').put(doctorResetCode);


module.exports =router;