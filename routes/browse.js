const express = require("express");
const User = require("../models/user.js");
const Book = require("../models/books.js");
const router = express.Router();
const userToView = require("../middleware/user-to-view.js");
const isSignedIn = require("../middleware/is-signed-in.js");

/* --------- GET ROUTES --------- */

router.get("/", async (req, res) => {
  const books = await Book.find().sort({ title: "asc" });
  res.render("browse/index", { books: books });
});

router.get("/:bookId", userToView, async (req, res) => {
  const book = await Book.findById(req.params.bookId)
  if (!req.session.user) return res.render("browse/show", { book, isSavedToShelf: false });

  const user = await User.findById(req.session.user._id);
  const matchingBook = user.books.find(b => b.isbn === book.isbn);

  if (matchingBook) {
    res.render("browse/show", { 
        book, 
        isSavedToShelf: true,
        bookInShelf: matchingBook,
    });
  } else {
    res.render("browse/show", { book, isSavedToShelf: false});
  }
});

/* --------- POST ROUTES --------- */

router.post("/:bookId", [isSignedIn, userToView], async (req, res) => {
  const user = await User.findById(req.session.user._id);
  const bookToAdd = await Book.findById(req.params.bookId);
  user.books.push(bookToAdd);
  await user.save();
  const book = user.books.find(b => b.isbn === bookToAdd.isbn);
  res.redirect(`/books/${book.id}`);
});

module.exports = router;