let books = [];
let unreadList = document.getElementById('unreadList');
let readList = document.getElementById('readList');
let searchInput = document.getElementById('searchInput');

// Load data from localStorage
loadBooksFromLocalStorage();

// Add book event listener
document.getElementById('addBookForm').addEventListener('submit', function(event) {
    event.preventDefault();

    let title = document.getElementById('title').value;
    let author = document.getElementById('author').value;
    let year = parseInt(document.getElementById('year').value);
    let isComplete = document.getElementById('isComplete').checked; // Get the checkbox value

    let newBook = {
        id: Date.now(),
        title: title,
        author: author,
        year: year,
        isComplete: isComplete
    };

    addBook(newBook);
    displayBooks();
    clearAddBookForm();
});

// Search book event listener
searchInput.addEventListener('input', function() {
    displayBooks(this.value);
});

// Add book function
function addBook(book) {
    books.push(book);
    saveBooksToLocalStorage();
}

// Display books function
function displayBooks(query = '') {
    unreadList.innerHTML = '';
    readList.innerHTML = '';

    books.filter(function(book) {
        return book.title.toLowerCase().includes(query.toLowerCase()) ||
               book.author.toLowerCase().includes(query.toLowerCase()) ||
               book.year.toString().includes(query.toLowerCase());
    }).forEach(function(book) {
        let listItem = document.createElement('li');
        listItem.innerHTML = `
            <h3>${book.title}</h3>
            <p>Penulis: ${book.author}</p>
            <p>Tahun: ${book.year}</p>
            <button data-id="${book.id}" class="${book.isComplete ? 'move-to-unread' : 'move-to-read'}">
                ${book.isComplete ? 'Tandai belum dibaca' : 'Tandai telah dibaca'}
            </button>
            <button data-id="${book.id}" class="remove-book">Remove</button>
        `;
        
        if (book.isComplete) {
            readList.appendChild(listItem);
        } else {
            unreadList.appendChild(listItem);
        }
    });
}

// Move book function
function moveBook(bookId, newIsComplete) {
    const bookIndex = books.findIndex(book => book.id === bookId);

    if (bookIndex !== -1) {
        books[bookIndex].isComplete = newIsComplete;
        saveBooksToLocalStorage();
        displayBooks(searchInput.value);
    }
}

// Remove book function
function removeBook(bookId) {
    const bookIndex = books.findIndex(book => book.id === bookId);

    if (bookIndex !== -1) {
        books.splice(bookIndex, 1);
        saveBooksToLocalStorage();
        displayBooks(searchInput.value);
    }
}

// Event listeners for move and remove buttons
document.addEventListener('click', function(event) {
    const target = event.target;

    if (target.classList.contains('move-to-unread')) {
        const bookId = parseInt(target.dataset.id);
        moveBook(bookId, false); // Mark as unread
    } else if (target.classList.contains('move-to-read')) {
        const bookId = parseInt(target.dataset.id);
        moveBook(bookId, true); // Mark as read
    } else if (target.classList.contains('remove-book')) {
        const bookId = parseInt(target.dataset.id);
        removeBook(bookId);
    }
});

// Save books to localStorage function
function saveBooksToLocalStorage() {
    localStorage.setItem('books', JSON.stringify(books));
}

// Load books from localStorage function
function loadBooksFromLocalStorage() {
    const booksFromStorage = localStorage.getItem('books');
    if (booksFromStorage) {
        books = JSON.parse(booksFromStorage);
    }
}

// Clear add book form function
function clearAddBookForm() {
    document.getElementById('addBookForm').reset();
}

// Display books on initial load
displayBooks();
