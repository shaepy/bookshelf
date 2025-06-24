const mongoose = require('mongoose');

// new books schema 
const booksSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subtitle: { type: String },
    author: { type: String, required: true },
    isbn: { type: Number, required: true, unique: true },
    genre: { type: String },
    language: { type: String },
    description: { type: String },
    year: { type: String },
    publisher: { type: String },
    pages: { type: Number },
    // for user preferences
    isOwned: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false },
    wantToRead: {type: Boolean, default: false },
    isFavorite: { type: Boolean, default: false },
    isReading: {type: Boolean, default: false }
});

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
    },
    books: [booksSchema], // this is embedded for books data
});

module.exports = mongoose.model("User", userSchema);