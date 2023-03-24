const mongoose = require('mongoose');

const diseaseSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            trim: true,
            required: [true, 'Name Required'],
        },
        slug: {
            type: String,
            lowercase: true,
        },
        Symptoms:[
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