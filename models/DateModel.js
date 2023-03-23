const mongoose = require('mongoose');

const DatesSchema = new mongoose.Schema(
    {
        nameOfDoctor:{
            type: mongoose.Schema.ObjectId,
            ref: 'User',
        },
        dates:{
            start: Date,
            numberOfClinic: Number,
            period: Number,
        }
    },
    {
        timestamps: true
    }
);


const DatesModel = mongoose.model('Date', DatesSchema);

module.exports = DatesModel;