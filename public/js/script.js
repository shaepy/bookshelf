const searchInput = document.querySelectorAll('.search-shelf')
const bookListElements = document.querySelectorAll('li.book')

searchInput.forEach(search => {
    search.addEventListener('input', e => {
        const value = e.target.value.toLowerCase()
        console.log(value)
        bookListElements.forEach(book => {
            const isVisible = book.textContent.toLowerCase().includes(value)
            book.classList.toggle('hidden', !isVisible)
        })
    })
})