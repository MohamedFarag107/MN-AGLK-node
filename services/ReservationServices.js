const asyncHandler = require("express-async-handler");
const ReservationModel = require("../models/reservationModel");
const UserModel = require("../models/userModel");
const ApiError = require("../utils/apiError");

// @desc    Get list of Reservations
// @route   GET /api/v1/reservations
// @access  Public
exports.getAllReservations = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;
  const reservations = await ReservationModel.find({}).skip(skip).limit(limit);
  res
    .status(200)
    .json({ results: reservations.length, page, data: reservations });
});

// @desc    Get specific Reservation by id
// @route   Get /api/v1/reservations/:id
// @access  Public
exports.getOneReservation = asyncHandler(async (req, res, next) => {
  const reservation = await ReservationModel.findById(req.params.id)
    .populate("therapistId")
    .populate("patientId");
  if (!reservation) {
    return next(
      new ApiError(
        `Not Found Any Reservation For This Id ${req.params.id}`,
        404
      )
    );
  }
  res.status(200).json({ data: reservation });
});

// @desc    Create Reservation
// @route   POST   /api/v1/reservations
// @access  Private
exports.createReservation = asyncHandler(async (req, res, next) => {
  const { therapistId, patientId, date, type } = req.body;
  // check if  numberOfReservations equal 0
  const therapistNumberOfReservations = await UserModel.findById(therapistId);
  if (therapistNumberOfReservations.numberOfReservations === 0) {
    return next(
      new ApiError(
        `therapist not have any Reservations empty ${therapistId}`,
        404
      )
    );
  }
  const reservation = await ReservationModel.create({
    therapistId,
    patientId,
    date,
    type,
  });
  const patient = await UserModel.findOneAndUpdate(
    {
      _id: req.body.patientId,
    },
    {
      $addToSet: { reservations: reservation._id },
    },
    {
      new: true,
    }
  );

  const therapist = await UserModel.findOneAndUpdate(
    {
      _id: req.body.therapistId,
    },
    {
      $addToSet: { reservations: reservation._id },
    },
    {
      new: true,
    }
  );
  const NumberOfReservationsAfterDecrement = await UserModel.findOneAndUpdate(
    {
      _id: req.body.therapistId,
    },
    {
      $inc: { numberOfReservations: -1 },
    },
    {
      new: true,
    }
  );
  res.status(201).json({
    status: "Success",
    message: "Reservation Added Successfully.",
    data: reservation,
  });
});

// @desc    Update Specific Reservation
// @route   PUT    /api/v1/reservations/:id
// @access  Private
exports.updateReservation = asyncHandler(async (req, res, next) => {
  const reservation = await ReservationModel.findOneAndUpdate(
    {
      _id: req.params.id,
    },
    {
      status: true,
      rate: req.body.rate,
    },
    { new: true }
  );
  if (!reservation) {
    return next(
      new ApiError(
        `Not Found Any Reservation For This Id  Or rated Before ${id}`,
        404
      )
    );
  }
  const totalRate = await ReservationModel.aggregate([
    {
      $match: { therapistId: reservation.therapistId },
    },
    {
      $group: {
        _id: "$therapistId",
        totalRate: { $sum: "$rate" },
        count: { $sum: 1 },
      },
    },
  ]);
  const therapist = await UserModel.findOneAndUpdate(
    {
      _id: reservation.therapistId,
    },
    {
      rating: totalRate[0].totalRate / totalRate[0].count,
    },
    {
      new: true,
    }
  );

  res.status(200).json({ data: reservation });
});

// @desc   Delete Specific Reservation
// @route  DELETE  /api/v1/reservations/:id
// @access Private
exports.deleteReservation = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const reservation = await ReservationModel.findByIdAndDelete(id);

  if (!reservation) {
    return next(
      new ApiError(`Not Found Any Reservation For This Id ${id}`, 404)
    );
  }
  res.status(204).json({ data: reservation });
});
