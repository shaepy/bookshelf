const express = require("express");
const Book = require("../models/books.js");
const User = require("../models/user.js");
const router = express.Router();
const queries = require("../controllers/queries/queries.js");
const userToView = require("../middleware/user-to-view.js");
const isSignedIn = require("../middleware/is-signed-in.js");

/* --------- GET ROUTES --------- */

router.get("/", async (req, res) => {
  let userBooks;
  if (req.session.user) {
    userBooks = await queries.getUserBooks(req.session.user._id)
  } else {
    userBooks = await Book.find().sort({ title: "asc" });
  }
  res.render("books/index", { books: userBooks });
});

router.get("/new", isSignedIn, (req, res) => {
  res.render("books/new");
});

router.get("/owned", [isSignedIn, userToView], async (req, res) => {
  const booksOwned = await queries.getOwnedBooks(req.session.user._id)
  res.render("books/collections/owned", { books: booksOwned });
});

router.get("/completed", [isSignedIn, userToView], async (req, res) => {
  const booksRead = await queries.getBooksRead(req.session.user._id)
  res.render("books/collections/completed", { books: booksRead });
});

router.get("/reading-list", [isSignedIn, userToView], async (req, res) => {
  const booksToRead = await queries.getWantToRead(req.session.user._id)
  const booksInProgress = await queries.getIsReading(req.session.user._id)
  res.render("books/collections/reading", {
    booksToRead: booksToRead,
    booksInProgress: booksInProgress,
  });
});

router.get("/favorites", [isSignedIn, userToView], async (req, res) => {
  const favoriteBooks = await queries.getFavorites(req.session.user._id)
  res.render("books/collections/favorites", { books: favoriteBooks });
});

router.get("/:bookId", [isSignedIn, userToView], async (req, res) => {
  const foundBook = await queries.getBookFromUser(req.session.user._id, req.params.bookId);
  if (!foundBook) return res.status(404).send("Book not found");
  res.render("books/show", { book: foundBook });
});

router.get("/:bookId/edit", [isSignedIn, userToView], async (req, res) => {
  const foundBook = await queries.getBookFromUser(req.session.user._id, req.params.bookId);
  if (!foundBook) return res.status(404).send("Book not found");
  res.render("books/edit", { book: foundBook });
});

router.get("/:bookId/delete", [isSignedIn, userToView], async (req, res) => {
  const foundBook = await queries.getBookFromUser(req.session.user._id, req.params.bookId);
  if (!foundBook) return res.status(404).send("Book not found");
  res.render("books/delete", { book: foundBook });
});

/* --------- POST ROUTES --------- */

router.post("/", async (req, res) => {
  const user = await User.findById(req.session.user._id)
  const { isOwned, isCompleted, wantToRead, isFavorite, isReading, ...bookData } = req.body;
  const newBook = {
    ...bookData,
    isOwned: isOwned === "on",
    isCompleted: isCompleted === "on",
    wantToRead: wantToRead === "on",
    isFavorite: isFavorite === "on",
    isReading: isReading === "on",
  };
  console.log(newBook);

  user.books.push(newBook);
  await user.save();
  res.redirect("/books");
});

/* --------- PUT ROUTES --------- */

router.put("/:bookId", async (req, res) => {
  const user = await User.findById(req.session.user._id);
  const book = user.books.id(req.params.bookId);
  if (!book) return res.status(404).send("Book not found");

  // const { title, subtitle, author, isbn, genre, language, description, year, publisher, 
  //   isOwned, isCompleted, wantToRead, isFavorite, isReading } = req.body;

  // book.title = title;
  // book.subtitle = subtitle;
  // book.author = author;
  // book.isbn = isbn;
  // book.genre = genre;
  // book.language = language;
  // book.description = description;
  // book.year = year;
  // book.publisher = publisher;
  // book.isOwned = isOwned === "on";
  // book.isCompleted = isCompleted === "on";
  // book.wantToRead = wantToRead === "on";
  // book.isFavorite = isFavorite === "on";
  // book.isReading = isReading === "on";

  const { isOwned, isCompleted, wantToRead, isFavorite, isReading, ...bookData } = req.body;
  const editBook = {
    ...bookData,
    isOwned: isOwned === "on",
    isCompleted: isCompleted === "on",
    wantToRead: wantToRead === "on",
    isFavorite: isFavorite === "on",
    isReading: isReading === "on",
  };

  book.set(editBook);
  await user.save();

  res.redirect(`/books/${req.params.bookId}`);
});

/* --------- DELETE ROUTES --------- */

router.delete("/:bookId", async (req, res) => {
   try {
    await User.findByIdAndUpdate(
      req.session.user._id,
      { $pull: { books: { _id: req.params.bookId } } }
    );
    res.redirect("/books");
  } catch (err) {
    console.error("Error removing book:", err);
    res.status(500).send("Failed to remove book.");
  }
});

module.exports = router;