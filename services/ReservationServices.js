const asyncHandler = require('express-async-handler')
const ReservationModel = require("../models/reservationModel");
const ApiError = require("../utils/apiError");




// @desc    Get list of Reservations
// @route   GET /api/v1/reservations
// @access  Public
exports.getAllReservations = asyncHandler( async(req,res)=>{
    const page = req.query.page*1 || 1;
    const limit = req.query.limit*1 || 5;
    const skip = (page - 1) * limit;
    const reservations = await ReservationModel.find({}).skip(skip).limit(limit);
    res.status(200).json({results: reservations.length, page, data: reservations});
});



// @desc    Get specific Reservation by id
// @route   Get /api/v1/reservations/:id
// @access  Public
exports.getOneReservation = asyncHandler( async(req,res,next)=>{
    const reservation =await ReservationModel.findById(req.params.id);
    if(!reservation){
        return next(new ApiError(`Not Found Any Reservation For This Id ${id}`, 404));
    }
    res.status(200).json({data: reservation});
});



// @desc    Create Reservation
// @route   POST   /api/v1/reservations
// @access  Private
exports.createReservation =asyncHandler( async (req,res)=>{
    const reservation = await ReservationModel.create(req.body);
    res.status(201).json({data: reservation});
});




// @desc    Update Specific Reservation
// @route   PUT    /api/v1/reservations/:id
// @access  Private
exports.updateReservation = asyncHandler( async(req,res,next)=>{
    const reservation = await ReservationModel.findOneAndUpdate(
        req.params.id,
        req.body,
        {new: true}
    );
    if(!reservation){
        return next(new ApiError(`Not Found Any Reservation For This Id ${id}`, 404));
    }
    res.status(200).json({data: reservation});
});



// @desc   Delete Specific Reservation
// @route  DELETE  /api/v1/reservations/:id
// @access Private
exports.deleteReservation = asyncHandler(async (req,res,next)=>{
    const {id} = req.params;
    const reservation = await ReservationModel.findByIdAndDelete(id);

    if(!reservation){
        return next(new ApiError(`Not Found Any Reservation For This Id ${id}`, 404));
    }
    res.status(204).json({data: reservation});
})
