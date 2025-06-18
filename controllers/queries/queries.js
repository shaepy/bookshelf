const User = require("../../models/user.js");

// returns that user's books array
const getUserBooks = async (userID) => {
  const user = await User.findById(userID).populate('books');
  user.books.sort((a, b) => a.title.localeCompare(b.title));
  return user.books;
};

const getOwnedBooks = async (userID) => {
  const user = await User.findById(userID).populate('books');
  user.books.sort((a, b) => a.title.localeCompare(b.title));
  return user.books.filter(book => book.isOwned === true);
};

const getBooksRead = async (userID) => {
  const user = await User.findById(userID).populate('books');
  user.books.sort((a, b) => a.title.localeCompare(b.title));
  return user.books.filter(book => book.isCompleted === true);
};

const getWantToRead = async (userID) => {
  const user = await User.findById(userID).populate('books');
  user.books.sort((a, b) => a.title.localeCompare(b.title));
  return user.books.filter(book => book.wantToRead === true && book.isReading === false);
};

const getIsReading = async (userID) => {
  const user = await User.findById(userID).populate('books');
  user.books.sort((a, b) => a.title.localeCompare(b.title));
  return user.books.filter(book => book.isReading === true);
};

const getFavorites = async (userID) => {
  const user = await User.findById(userID).populate('books');
  user.books.sort((a, b) => a.title.localeCompare(b.title));
  return user.books.filter(book => book.isFavorite === true);
};

module.exports = {
    getUserBooks,
    getOwnedBooks,
    getBooksRead,
    getWantToRead,
    getIsReading,
    getFavorites
};