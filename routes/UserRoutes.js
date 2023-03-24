const express = require('express');

const router = express.Router();

const {
    getUser,
    updateUserPassword,
    uploadUserImage,
    resizeImage,
    getLoggedUserData,
    updateLoggedUserPassword,
    updateLoggedUserData,
    deleteLoggedUserData
} = require('../services/UserServices');

const {protect } = require('../services/AuthServices');

router.get('/getMe',protect, getLoggedUserData, getUser )
router.put('/changeMyPassword',protect, updateLoggedUserPassword);
router.put('/updateMe',protect, uploadUserImage,resizeImage, updateLoggedUserData);
router.delete('/deleteMe',protect, deleteLoggedUserData);

// router.put('/changePassword/:id', updateUserPassword);



module.exports = router;