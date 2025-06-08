const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String },
    language: { type: String },
    isbn: { type: Number, unique: true },
    description: { type: String },
    year: { type: String },
    publisher: { type: String },
    pages: { type: Number },
    isOwned: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false },
    wantToRead: {type: Boolean, default: false },
    isFavorite: { type: Boolean, default: false },
    isReading: {type: Boolean, default: false }
})

module.exports = mongoose.model('Book', bookSchema)