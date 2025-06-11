const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Book = require("./models/books.js");
const methodOverride = require("method-override");
const morgan = require("morgan");

const app = express();
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));

// only cache images
app.use((req, res, next) => {
  const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".svg", ".webp"];
  const ext = path.extname(req.url);

  if (allowedExtensions.includes(ext)) {
    express.static(path.join(__dirname, "public"), {
      maxAge: 31536000 * 1000,
    })(req, res, next);
  } else {
    next();
  }
});

app.use(express.static(path.join(__dirname, "public"), {
  setHeaders: (res, filePath) => {
    res.setHeader("Cache-Control", "no-store");
  }
}));

// Global searchResults object
let searchResults;

/* --------- GET ROUTES --------- */

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/search", (req, res) => {
  res.render("search/index");
});

app.get("/search/results", (req, res) => {
  res.render("search/results", { results: searchResults });
});

app.get("/search/works/:resultId", async (req, res) => {
  const edition = await fetchEdition(req.params.resultId);
  res.render("search/show", { edition: edition });
});

app.get("/books", async (req, res) => {
  const allBooks = await Book.find().sort({ title: "asc" });
  res.render("books/index", { books: allBooks });
});

app.get("/books/new", (req, res) => {
  res.render("books/new");
});

app.get("/books/owned", async (req, res) => {
  const ownedBooks = await Book.find({ isOwned: true }).sort({ title: "asc" });
  res.render("books/collections/owned", { books: ownedBooks });
});

app.get("/books/completed", async (req, res) => {
  const finishedBooks = await Book.find({ isCompleted: true }).sort({
    title: "asc",
  });
  res.render("books/collections/completed", { books: finishedBooks });
});

app.get("/books/reading-list", async (req, res) => {
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

app.get("/books/favorites", async (req, res) => {
  const favoriteBooks = await Book.find({ isFavorite: true }).sort({
    title: "asc",
  });
  res.render("books/collections/favorites", { books: favoriteBooks });
});

app.get("/books/:bookId", async (req, res) => {
  const foundBook = await Book.findById(req.params.bookId);
  res.render("books/show", { book: foundBook });
});

app.get("/books/:bookId/edit", async (req, res) => {
  const foundBook = await Book.findById(req.params.bookId);
  res.render("books/edit", { book: foundBook });
});

app.get("/books/:bookId/delete", async (req, res) => {
  const foundBook = await Book.findById(req.params.bookId);
  res.render("books/delete", { book: foundBook });
});

/* --------- POST ROUTES --------- */

app.post("/books", async (req, res) => {
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

app.post("/search/results/:isbn", async (req, res) => {
  const bookModel = await fetchBookByISBN(req.params.isbn);
  const newBook = await Book.create(bookModel);
  res.redirect(`/books/${newBook.id}`);
});

app.post("/search", async (req, res) => {
  const { title, author, limitResults } = req.body;
  searchResults = title
    ? await openLibraryReq(title, "title", limitResults)
    : await openLibraryReq(author, "author", limitResults);
  res.redirect("/search/results");
});

async function openLibraryReq(search, label, limit) {
  const response = await fetch(
    `https://openlibrary.org/search.json?${label}=${search}&limit=${limit}`
  );
  if (!response.ok) throw new Error("Failed to fetch book data");
  return await response.json();
}

async function fetchEdition(resultId) {
  const response = await fetch(
    `https://openlibrary.org/works/${resultId}/editions.json`
  );
  if (!response.ok) throw new Error("Failed to fetch book data");
  return await response.json();
}

async function fetchBookByISBN(bookId) {
  let edition = await fetch(`https://openlibrary.org/isbn/${bookId}.json`);
  if (!edition.ok) throw new Error("Failed to fetch edition data");
  edition = await edition.json();

  // call for language
  let languageReq;
  if (edition.languages) {
    languageReq = await fetch(
      `https://openlibrary.org${edition.languages[0].key}.json`
    );
    if (!languageReq.ok) throw new Error("Failed to fetch language data");
    languageReq = await languageReq.json();
  }
  // call for author
  let authorReq;
  if (edition.authors) {
    authorReq = await fetch(
      `https://openlibrary.org${edition.authors[0].key}.json`
    );
    if (!authorReq.ok) throw new Error("Failed to fetch author data");
    authorReq = await authorReq.json();
  }
  // call for description
  let bookJson = await fetch(
    `https://openlibrary.org${edition.works[0].key}.json`
  );
  if (!bookJson.ok) throw new Error("Failed to fetch book data");
  bookJson = await bookJson.json();

  const publisher = edition.publishers[0];
  const publishDate = edition.publish_date;
  const language = languageReq ? languageReq.name : "English";
  const author = authorReq ? authorReq.name : "Unknown Author";
  const description = bookJson.description ? bookJson.description.value : "Unknown";
  const genre = bookJson.subjects.slice(0, 7).join(",");

  const book = {
    title: edition.title,
    author: author,
    genre: genre,
    language: language,
    isbn: Number(bookId),
    description: description,
    year: publishDate,
    publisher: publisher,
    pages: edition.number_of_pages,
    isOwned: false,
    isCompleted: false,
    wantToRead: true,
    isFavorite: false,
    isReading: false,
  };
  return book;
}

/* --------- PUT ROUTES --------- */

app.put("/books/:bookId", async (req, res) => {
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

app.delete("/books/:bookId", async (req, res) => {
  await Book.findByIdAndDelete(req.params.bookId);
  res.redirect("/books");
});

/* --------- CONNECTIONS --------- */

mongoose.connect(process.env.MONGODB_URI);

try {
  mongoose.connection.on("connected", () => {
    console.log(
      `Connected to MongoDB collection: ${mongoose.connection.name}.`
    );
  });
} catch (error) {
  console.log(
    `Failed to connect to MongoDB collection: ${mongoose.connection.name}`
  );
}

app.listen(process.env.PORT, () => {
  console.log(`App is listening on port ${process.env.PORT}`);
});
