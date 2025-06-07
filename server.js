const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const path = require("path")
const mongoose = require('mongoose')
const Book = require('./models/books.js')
const methodOverride = require("method-override"); 
const morgan = require("morgan"); 

const app = express()
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride("_method")); 
app.use(morgan("dev")); 

app.get('/', (req, res) => {
  res.render('index')
})

/* --------- GET ROUTES --------- */

app.get('/books', async (req, res) => {
  let allBooks = await Book.find()
  allBooks = allBooks.sort((a, b) => a.title - b.title)
  res.render('books/index', { books: allBooks })
})

app.get('/books/new', (req, res) => {
  res.render('books/new')
})

app.get('/books/owned', async (req, res) => {
  const ownedBooks = await Book.find({ isOwned : true })
  res.render('books/collections/owned', { books: ownedBooks })
})

app.get('/books/completed', async (req, res) => {
  const finishedBooks = await Book.find({ isCompleted : true })
  res.render('books/collections/completed', { books: finishedBooks })
})

app.get('/books/reading-list', async (req, res) => {
  const wantToReadBooks = await Book.find({ wantToRead : true })
  res.render('books/collections/reading', { books: wantToReadBooks })
})

app.get('/books/favorites', async (req, res) => {
  const favoriteBooks = await Book.find({ isFavorite : true })
  res.render('books/collections/favorites', { books: favoriteBooks })
})

app.get('/books/:bookId', async (req, res) => {
  const foundBook = await Book.findById(req.params.bookId)
  res.render('books/show', { book: foundBook })
})

app.get('/books/:bookId/edit', async (req, res) => {
  const foundBook = await Book.findById(req.params.bookId)
  res.render('books/edit', { book: foundBook })
})

app.get('/books/:bookId/delete', async (req, res) => {
  const foundBook = await Book.findById(req.params.bookId)
  res.render('books/delete', { book: foundBook })
})

/* --------- POST ROUTES --------- */

app.post('/books', async (req, res) => {
  req.body.isOwned = req.body.isOwned === 'on' ? true : false
  req.body.isCompleted = req.body.isCompleted === 'on' ? true : false
  req.body.wantToRead = req.body.wantToRead === 'on' ? true : false
  req.body.isFavorite = req.body.isFavorite === 'on' ? true : false
  const newBook = await Book.create(req.body)
  console.log(newBook)
  res.redirect('/books')
})

/* --------- PUT ROUTES --------- */

app.put('/books/:bookId', async (req, res) => {
  req.body.isOwned = req.body.isOwned === 'on' ? true : false
  req.body.isCompleted = req.body.isCompleted === 'on' ? true : false
  req.body.wantToRead = req.body.wantToRead === 'on' ? true : false
  req.body.isFavorite = req.body.isFavorite === 'on' ? true : false
  await Book.findByIdAndUpdate(req.params.bookId, req.body)
  res.redirect(`/books/${req.params.bookId}`)
})

/* --------- DELETE ROUTES --------- */

app.delete('/books/:bookId', async (req, res) => {
  await Book.findByIdAndDelete(req.params.bookId)
  res.redirect('/books')
})

/* --------- CONNECTIONS --------- */

mongoose.connect(process.env.MONGODB_URI)

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`)
})

app.listen(process.env.PORT, () => {
    console.log(`App is listening on port ${process.env.PORT}`)
})

