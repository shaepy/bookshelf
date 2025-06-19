const express = require("express");
const User = require("../models/user.js");
const router = express.Router();

// !Change to session-based, not global 
// Global searchResults object
let searchResults;

// TODO-ST: create show pages for search result books to see information
// eventually will allow access without auth for search

/* --------- GET ROUTES --------- */

router.get("/", (req, res) => {
  res.render("search/index");
});

router.get("/results", (req, res) => {
  res.render("search/results", { results: searchResults });
});

router.get("/works/:resultId", async (req, res) => {
  const editions = await fetchEditions(req.params.resultId);
  res.render("search/editions", { editions: editions });
});

/* --------- POST ROUTES --------- */

router.post("/results/:isbn", async (req, res) => {
  const user = await User.findById(req.session.user._id);
  const book = await fetchBookByISBN(req.params.isbn);

  user.books.push(book);
  await user.save();

  const newBook = user.books.find(b => b.isbn === Number(req.params.isbn));
  console.log(newBook);

  res.redirect(`/books/${newBook.id}`);
});

router.post("/", async (req, res) => {
  const { title, author, limitResults } = req.body;
  searchResults = title
    ? await openLibraryReq(title, "title", limitResults)
    : await openLibraryReq(author, "author", limitResults);
  res.redirect("/search/results");
});

/* --------- FUNCTIONS --------- */

async function openLibraryReq(search, label, limit) {
  const response = await fetch(
    `https://openlibrary.org/search.json?${label}=${search}&limit=${limit}`
  );
  if (!response.ok) throw new Error("Failed to fetch book data");
  return await response.json();
}

async function fetchEditions(resultId) {
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

  const publisher = edition.publishers[0] ? edition.publishers[0] : "Unknown Publisher"
  const language = languageReq ? languageReq.name : "English (Default)";
  const author = authorReq ? authorReq.name : "Unknown Author";
  const description = bookJson.description ? bookJson.description.value : "No description found";
  const genre = bookJson.subjects.slice(0, 7).join(", ");

  const book = {
    title: edition.title,
    author: author,
    genre: genre,
    language: language,
    isbn: Number(bookId),
    description: description,
    year: edition.publish_date,
    publisher: publisher,
    pages: edition.number_of_pages,
    isOwned: false,
    isCompleted: false,
    wantToRead: true,
    isFavorite: false,
    isReading: false,
  };
  return book;
};

module.exports = router;