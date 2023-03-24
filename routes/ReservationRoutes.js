const express = require('express');

const router = express.Router();


const {
    getAllReservations,
    getOneReservation,
    createReservation,
    updateReservation,
    deleteReservation
} = require('../services/ReservationServices');



router.route('/')
    .get(getAllReservations)
    .post(createReservation);

router.route('/:id')
    .get(getOneReservation)
    .put(updateReservation)
    .delete(deleteReservation);

module.exports = router;