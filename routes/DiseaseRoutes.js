const express = require('express');

const router = express.Router();


const {
    getAllDiseases,
    getOneDisease,
    createDisease,
    updateDisease,
    deleteDisease
} = require('../services/DiseaseServices');



router.route('/')
    .get(getAllDiseases)
    .post(createDisease);

router.route('/:id')
    .get(getOneDisease)
    .put(updateDisease)
    .delete(deleteDisease);

module.exports = router;