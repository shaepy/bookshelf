const searchInput = document.querySelectorAll('.search-shelf')

// hide bookListElements if doesn't match
const bookListElements = document.querySelectorAll('li.book')

// Add an event listener to search input that logs the value of whatever is typed
searchInput.forEach(search => {
    search.addEventListener('input', e => {
        const value = e.target.value.toLowerCase()
        console.log(value)
        bookListElements.forEach(book => {
            // sets to true or false if includes value
            const isVisible = book.textContent.toLowerCase().includes(value)
            book.classList.toggle('hidden', !isVisible)
        })
    })
})