const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            trim: true,
            required: [true, 'Name Required'],
        },
        email: {
            type: String,
            required: [true, 'Email Required'],
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: [true, 'Password Required'],
            minlength: [6, 'Too Short Password'],
        },
        type: {
            type: String,
            enum: ['admin', 'patient','therapist'],
            default: 'patient',
        },
        profileImage: String,
        reservations:[
            {
                type: mongoose.Schema.ObjectId,
                ref: 'Reservation',
            }
        ],
        numberOfReservations: {
            type: Number,
        },
        price:{
            type: Number,
        },
        rating:{
            type: Number,
        },
        // id, id, date
        //Password Reset Fields
        passwordChangedAt: Date,
        passwordResetCode: String,
        passwordResetExpires: Date,
        passwordResetVerified: Boolean,

    },
    {
        timestamps: true
    }
);

userSchema.pre('save', async function (next){
    if(!this.isModified('password')) return next();

    //Hashing User Password
    this.password = await bcrypt.hash(this.password, 12);
    next();
});





const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;