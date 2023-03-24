const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
    {
        title:{
            type: String,
            trim: true,
            required: [true, 'title Required'],
        },
        author:{
            type: String,
            trim: true,
            required: [true, 'author Required'],
        },
        slug: {
            type: String,
            lowercase: true,
        },
        description: {
            type: String,
            required: [true, 'Description Required'],
        },
        bookImage: String,
        bookFile: String,
    },
    {
        timestamps: true
    }
);



const BookModel = mongoose.model('Book', bookSchema);

module.exports = BookModel;