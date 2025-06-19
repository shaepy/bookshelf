const searchInput = document.querySelectorAll(".search-shelf");
const bookListElements = document.querySelectorAll("li.book");

searchInput.forEach((search) => {
  search.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase();
    bookListElements.forEach((book) => {
      const isVisible = book.textContent.toLowerCase().includes(value);
      book.classList.toggle("hidden", !isVisible);
    });
  });
});

// TODO-ST need to build search input for browse as well
// const searchBrowseInput = document.querySelector(".search-browse");
// const bookDetailsParaElement = document.querySelectorAll(".browse-book-details");

// searchBrowseInput.addEventListener("input", (e) => {
//   const value = e.target.value.toLowerCase();
//   console.log(value);
//   bookDetailsParaElement.forEach((el) => {
//     const isVisible = el.textContent.toLowerCase().includes(value);
//     el.classList.toggle("hidden", !isVisible);
//   });
// });