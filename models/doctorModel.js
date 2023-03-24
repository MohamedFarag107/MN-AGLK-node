const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const doctorSchema = new mongoose.Schema(
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
        email: {
            type: String,
            required: [true, 'Email Required'],
            unique: true,
            lowercase: true,
        },
        phone:{
            type: String,
            required: [true, 'Phone Required'],
        } ,
        profileImage: String,
        password: {
            type: String,
            required: [true, 'Password Required'],
            minlength: [6, 'Too Short Password'],
        },
        role: {
            type: String,
            default: 'doctor',
        },
        address:{
            type: String,
        },
        ratings: {
            type: Number,
            min: [1, 'Rating Must Be Above Or Equal 1.0'],
            max: [5, 'Rating Must Be Below Or Equal 5.0'],
        },
        price: {
            type: Number,
        },
        specialty:{
            type: String,
        },
        specializedIn:{
            type: String,
        },
        Certificate:[String],
        Experience:{
            type: String,
        },
        passwordChangedAt: Date,
        passwordResetCode: String,
        passwordResetExpires: Date,
        passwordResetVerified: Boolean,

    },
    {
        timestamps: true
    }
);

doctorSchema.pre('save', async function (next){
    if(!this.isModified('password')) return next();

    //Hashing User Password
    this.password = await bcrypt.hash(this.password, 12);
    next();
});




const DoctorModel = mongoose.model('Doctor', doctorSchema);

module.exports = DoctorModel;