const express = require("express");
const Book = require("../models/books.js");
const router = express.Router();

/* --------- GET ROUTES --------- */

router.get("/", async (req, res) => {
  const allBooks = await Book.find().sort({ title: "asc" });
  res.render("books/index", { books: allBooks });
});

router.get("/new", (req, res) => {
  res.render("books/new");
});

router.get("/owned", async (req, res) => {
  const ownedBooks = await Book.find({ isOwned: true }).sort({ title: "asc" });
  res.render("books/collections/owned", { books: ownedBooks });
});

router.get("/completed", async (req, res) => {
  const finishedBooks = await Book.find({ isCompleted: true }).sort({
    title: "asc",
  });
  res.render("books/collections/completed", { books: finishedBooks });
});

router.get("/reading-list", async (req, res) => {
  const booksToRead = await Book.find({
    $and: [{ wantToRead: true }, { isReading: false }],
  }).sort({ title: "asc" });
  const booksInProgress = await Book.find({ isReading: true }).sort({
    title: "asc",
  });
  res.render("books/collections/reading", {
    booksToRead: booksToRead,
    booksInProgress: booksInProgress,
  });
});

router.get("/favorites", async (req, res) => {
  const favoriteBooks = await Book.find({ isFavorite: true }).sort({
    title: "asc",
  });
  res.render("books/collections/favorites", { books: favoriteBooks });
});

router.get("/:bookId", async (req, res) => {
  const foundBook = await Book.findById(req.params.bookId);
  res.render("books/show", { book: foundBook });
});

router.get("/:bookId/edit", async (req, res) => {
  const foundBook = await Book.findById(req.params.bookId);
  res.render("books/edit", { book: foundBook });
});

router.get("/:bookId/delete", async (req, res) => {
  const foundBook = await Book.findById(req.params.bookId);
  res.render("books/delete", { book: foundBook });
});

/* --------- POST ROUTES --------- */

router.post("/", async (req, res) => {
  const {
    isOwned,
    isCompleted,
    wantToRead,
    isFavorite,
    isReading,
    ...bookData
  } = req.body;
  const newBook = await Book.create({
    ...bookData,
    isOwned: isOwned === "on",
    isCompleted: isCompleted === "on",
    wantToRead: wantToRead === "on",
    isFavorite: isFavorite === "on",
    isReading: isReading === "on",
  });
  console.log(newBook);
  res.redirect("/books");
});

/* --------- PUT ROUTES --------- */

router.put("/:bookId", async (req, res) => {
  const {
    isOwned,
    isCompleted,
    wantToRead,
    isFavorite,
    isReading,
    ...bookData
  } = req.body;
  await Book.findByIdAndUpdate(req.params.bookId, {
    ...bookData,
    isOwned: isOwned === "on",
    isCompleted: isCompleted === "on",
    wantToRead: wantToRead === "on",
    isFavorite: isFavorite === "on",
    isReading: isReading === "on",
  });
  res.redirect(`/books/${req.params.bookId}`);
});

/* --------- DELETE ROUTES --------- */

router.delete("/:bookId", async (req, res) => {
  await Book.findByIdAndDelete(req.params.bookId);
  res.redirect("/books");
});

module.exports = router;