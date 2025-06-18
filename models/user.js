const mongoose = require('mongoose');

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
    books: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Book" }
    ],
});

module.exports = mongoose.model("User", userSchema);