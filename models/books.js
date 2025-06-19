const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
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
})

module.exports = mongoose.model('Book', bookSchema)