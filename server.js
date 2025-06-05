const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const path = require("path")
const mongoose = require('mongoose')
const Book = require('./models/books.js')

const app = express()
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/books', async (req, res) => {
  const allBooks = await Book.find()
  console.log(allBooks)
  res.render('books/index', { books: allBooks })
})

app.get('/books/new', (req, res) => {
  res.render('books/new')
})

app.post('/books', async (req, res) => {
  // this will be where we get the data from the post form
  req.body.isOwned = req.body.isOwned === 'on' ? true : false
  const newBook = await Book.create(req.body)
  console.log(newBook)
  res.redirect('/books')
})

mongoose.connect(process.env.MONGODB_URI)

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`)
})

app.listen(process.env.PORT, () => {
    console.log(`App is listening on port ${process.env.PORT}`)
})

