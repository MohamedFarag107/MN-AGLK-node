const mongoose = require('mongoose');

const DatesSchema = new mongoose.Schema(
    {
        date:{
            type:date,
            required: [true, 'Date Required'],
        },
        day:{
            type: String,
            enum: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            required: [true, 'Day Required'],
        },
        start:{
            type: String,
            required: [true, 'Start Required'],
        },
        end:{
            type: String,
            required: [true, 'End Required'],
        },
        doctor: {
            type: mongoose.Schema.ObjectId,
            ref: 'Doctor',
            required: [true, 'date Must Be Belong To doctor'],
        },
    },
    {
        timestamps: true
    }
);

// date day start end [{date: , day: , start: , end:}]
const DatesModel = mongoose.model('Date', DatesSchema);

module.exports = DatesModel;