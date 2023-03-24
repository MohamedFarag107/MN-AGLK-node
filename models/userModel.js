const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
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
        passwordChangedAt: Date,
        passwordResetCode: String,
        passwordResetExpires: Date,
        passwordResetVerified: Boolean,
        role: {
            type: String,
            enum: ['admin', 'patient'],
            default: 'patient',
        },
        address:{
            type: String,
        },
        reservations:[
            {
                type: mongoose.Schema.ObjectId,
                ref: 'Reservation'
            }
        ]
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