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
        description: {
            type: String,
            required: [true, 'Description Required'],
        },
        bookImage:{
            type: String,
            default: "",
        },
        bookFile:{
            type:String,
            default: "",
        }
    },
    {
        timestamps: true
    }
);



const BookModel = mongoose.model('Book', bookSchema);

module.exports = BookModel;