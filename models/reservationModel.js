const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema(
    {
        therapist:{
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Please Provide Therapist Id']
        },
        patient:{
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Please Provide Patient Id']
        },
        date: {
            type: Date
        },
        status:{
            type: Boolean,
            default: false,
        },
        rate:{
            type: Number,
            default: 5,
        }
    },
    {
        timestamps: true
    }
);

// date day start end [{date: , day: , start: , end:}]
const ReservationModel = mongoose.model('Reservation', ReservationSchema);

module.exports = ReservationModel;