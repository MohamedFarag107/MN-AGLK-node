const {check, body} = require('express-validator');
const { default: slugify } = require('slugify');

const validatorMiddleWare = require('../../middleware/validatorMiddleWare');
const userModel = require('../../models/userModel');





// @desc     Rules For Validation Signup User
exports.signupValidator = [
    check('name')
        .notEmpty()
        .withMessage('User Name Required')
        .isLength({min: 3})
        .withMessage('Too Short User Name')
        .isLength({max: 32})
        .withMessage('Too Long User Name'),

    check('email')
    .notEmpty()
    .withMessage('Email required')
    .isEmail()
    .withMessage('Invalid email address')
    .custom((val) =>
        userModel.findOne({ email: val }).then((user) => {
            if (user) {
                return Promise.reject(new Error('E-mail already Exist'));
            }
        })
    ),



    check('phone')
        .optional()
        .isMobilePhone(['ar-EG'])
        .withMessage('Invalid Phone Number Accepted Only EGYPT Numbers'),

    check('password')
        .notEmpty()
        .withMessage('Password Required')
        .isLength({min: 6})
        .withMessage('Password Must Be At Least 6 Characters')
        .custom((password, {req})=>{
            if(password !== req.body.passwordConfirm){
                throw new Error('Password Confirmation Incorrect');
            }
            return true;
        }),

    check('passwordConfirm')
        .notEmpty()
        .withMessage('Password Confirmation Required'),


    validatorMiddleWare,
];



// @desc     Rules For Validation Login User
exports.loginValidator = [
    check('email')
    .notEmpty()
    .withMessage('Email required')
    .isEmail()
    .withMessage('Invalid email address'),

    check('password')
        .notEmpty()
        .withMessage('Password Required')
        .isLength({min: 6})
        .withMessage('Password Must Be At Least 6 Characters'),

    validatorMiddleWare,
];



