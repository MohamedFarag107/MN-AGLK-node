const express = require('express');

const router = express.Router();

const {
    getUser,
    getAllTherapist,
    updateUserPassword,
    getLoggedUserData,
    updateLoggedUserPassword,
    updateLoggedUserData,
    deleteLoggedUserData,
    uploadUserImage,
    // resizeUserImageAndSave,
} = require('../services/UserServices');

const {protect } = require('../services/AuthServices');

router.get('/getMe',protect, getLoggedUserData, getUser )
router.put('/changeMyPassword',protect, updateLoggedUserPassword);
router.put('/updateMe',protect, uploadUserImage, updateLoggedUserData);
router.delete('/deleteMe',protect, deleteLoggedUserData);

router.put('/changePassword/:id', updateUserPassword);

router.get("/getAllTherapist", getAllTherapist);

module.exports = router;