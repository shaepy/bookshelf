const express = require("express");
const Book = require("../models/books.js");
const User = require("../models/user.js");
const router = express.Router();
const queries = require("../controllers/queries/queries.js");

const updateShaeCollection = async () => {
  // user is shae
  const shaeUser = "6851afa0727b9baab62e36eb"
  // all books from Book
  const books = await Book.find().sort({ title: "asc" });

  books.forEach(book => {
    User.findByIdAndUpdate(shaeUser, { 
      $push : { books: book._id }
    });
  });
}

/* --------- GET ROUTES --------- */

router.get("/", async (req, res) => {
  updateShaeCollection();
  let userBooks;
  if (req.session.user) {
    userBooks = await queries.getUserBooks(req.session.user._id)
  } else {
    userBooks = await Book.find().sort({ title: "asc" });
  }
  res.render("books/index", { books: userBooks });
});

router.get("/all", async (req, res) => {
  const allBooks = await Book.find().sort({ title: "asc" });
  res.render("books/collections/all-books", { books: allBooks })
})

router.get("/new", (req, res) => {
  res.render("books/new");
});

router.get("/owned", async (req, res) => {
  const booksOwned = await queries.getOwnedBooks(req.session.user._id)
  // const booksOwned = await Book.find({ isOwned: true }).sort({ title: "asc" });
  res.render("books/collections/owned", { books: booksOwned });
});

router.get("/completed", async (req, res) => {
  const booksRead = await queries.getBooksRead(req.session.user._id)
  // const finishedBooks = await Book.find({ isCompleted: true }).sort({
  //   title: "asc",
  // });
  res.render("books/collections/completed", { books: booksRead });
});

router.get("/reading-list", async (req, res) => {
  const booksToRead = await queries.getWantToRead(req.session.user._id)
  const booksInProgress = await queries.getIsReading(req.session.user._id)
  // const booksToRead = await Book.find({
  //   $and: [{ wantToRead: true }, { isReading: false }],
  // }).sort({ title: "asc" });
  // const booksInProgress = await Book.find({ isReading: true }).sort({
  //   title: "asc",
  // });
  res.render("books/collections/reading", {
    booksToRead: booksToRead,
    booksInProgress: booksInProgress,
  });
});

router.get("/favorites", async (req, res) => {
  const favoriteBooks = await queries.getFavorites(req.session.user._id)
  // const favoriteBooks = await Book.find({ isFavorite: true }).sort({
  //   title: "asc",
  // });
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

// #after creating a new book, we need to add this to the SPECIFIC USER'S COLLECTION
  const user = await User.findOne({ username: req.session.user.username })

// add to books []
  await User.findByIdAndUpdate(user.id, { 
    $push : { books: newBook.id }
  });

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