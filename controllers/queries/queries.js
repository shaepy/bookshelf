const User = require("../../models/user.js");

const getUser = async (userID) => {
  return await User.findById(userID);
};

const getBookFromUser = async (userID, bookID) => {
  const user = await getUser(userID);
  return user.books.find(b => b.id === bookID);
};

const getBookFromSearch = async (userID, matchISBN) => {
  const user = await getUser(userID);
  return user.books.find(book => book.isbn === matchISBN)
}

const getUserBooks = async (userID) => {
  const user = await getUser(userID);
  user.books.sort((a, b) => a.title.localeCompare(b.title));
  return user.books;
};

const getOwnedBooks = async (userID) => {
  const user = await getUser(userID);
  user.books.sort((a, b) => a.title.localeCompare(b.title));
  return user.books.filter(book => book.isOwned === true);
};

const getBooksRead = async (userID) => {
  const user = await getUser(userID);
  user.books.sort((a, b) => a.title.localeCompare(b.title));
  return user.books.filter(book => book.isCompleted === true);
};

const getWantToRead = async (userID) => {
  const user = await getUser(userID);
  user.books.sort((a, b) => a.title.localeCompare(b.title));
  return user.books.filter(book => book.wantToRead === true && book.isReading === false);
};

const getIsReading = async (userID) => {
  const user = await getUser(userID);
  user.books.sort((a, b) => a.title.localeCompare(b.title));
  return user.books.filter(book => book.isReading === true);
};

const getFavorites = async (userID) => {
  const user = await getUser(userID);
  user.books.sort((a, b) => a.title.localeCompare(b.title));
  return user.books.filter(book => book.isFavorite === true);
};

module.exports = {
    getUserBooks,
    getOwnedBooks,
    getBooksRead,
    getWantToRead,
    getIsReading,
    getFavorites,
    getBookFromUser,
    getBookFromSearch
};