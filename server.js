const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const path = require("path")
const mongoose = require('mongoose')
const Book = require('./models/books.js')
const methodOverride = require("method-override"); // new
const morgan = require("morgan"); //new

const app = express()
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride("_method")); // new
app.use(morgan("dev")); //new

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/books', async (req, res) => {
  const allBooks = await Book.find()
  res.render('books/index', { books: allBooks })
})

app.post('/books', async (req, res) => {
  // this will be where we get the data from the post form
  req.body.isOwned = req.body.isOwned === 'on' ? true : false
  const newBook = await Book.create(req.body)
  console.log(newBook)
  res.redirect('/books')
})

app.get('/books/new', (req, res) => {
  res.render('books/new')
})

app.get('/books/:bookId', async (req, res) => {
  const foundBook = await Book.findById(req.params.bookId)
  res.render('books/show', { book: foundBook })
})

app.get('/books/:bookId/edit', async (req, res) => {
  const foundBook = await Book.findById(req.params.bookId)
  res.render('books/edit', { book: foundBook })
})

app.put('/books/:bookId', async (req, res) => {
  req.body.isOwned = req.body.isOwned === 'on' ? true : false
  // update the fruit
  await Book.findByIdAndUpdate(req.params.bookId, req.body)
  res.redirect(`/books/${req.params.bookId}`)
})

app.delete('/books/:bookId', async (req, res) => {
  // ! ADD ADDITIONAL CHECK to avoid accidental deletions
  await Book.findByIdAndDelete(req.params.bookId)
  res.redirect('/books')
})

mongoose.connect(process.env.MONGODB_URI)

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`)
})

app.listen(process.env.PORT, () => {
    console.log(`App is listening on port ${process.env.PORT}`)
})

