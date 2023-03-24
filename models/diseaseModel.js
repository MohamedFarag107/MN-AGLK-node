const mongoose = require('mongoose');

const diseaseSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            trim: true,
            required: [true, 'Name Required'],
        },
        symptoms:[
            {
                type: String,
            }
        ]
    },
    {
        timestamps: true
    }
);

const DiseaseModel = mongoose.model('Disease', diseaseSchema);

module.exports = DiseaseModel;