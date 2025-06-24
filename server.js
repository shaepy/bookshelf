const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const session = require('express-session');

const bookRoutes = require("./routes/books.js");
const searchRoutes = require("./routes/search.js");
const browseRoutes = require("./routes/browse.js");
const authController = require("./controllers/auth.js");
const userToView = require("./middleware/user-to-view.js");

const app = express();
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));

// only cache images
app.use((req, res, next) => {
  const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".svg", ".webp"];
  const ext = path.extname(req.url).toLowerCase();

  if (allowedExtensions.includes(ext)) {
    express.static(path.join(__dirname, "public"), {
      maxAge: 31536000 * 1000,
    })(req, res, next);
  } else {
    next();
  }
});

app.use(express.static(path.join(__dirname, "public")));

// app.use(express.static(path.join(__dirname, "public"), {
//   setHeaders: (res, filePath) => {
//     res.setHeader("Cache-Control", "no-store");
//   }
// }));

/* --------- MONGODB CONNECTION --------- */

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

/* --------- HOME ROUTE --------- */

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(userToView);

app.use('/auth', authController);

app.get('/', (req, res) => {
  res.render("index");
});

app.use('/books', bookRoutes)
app.use('/browse', browseRoutes)
app.use('/search', searchRoutes)

app.listen(process.env.PORT, () => {
  console.log(`App is listening on port ${process.env.PORT}`);
});