const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
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
        description: {
            type: String,
            required: [true, 'Description Required'],
        },
        profileImage: String,
        bookFile: String,
    },
    {
        timestamps: true
    }
);


const BookModel = mongoose.model('Book', bookSchema);

module.exports = BookModel;