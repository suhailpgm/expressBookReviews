const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const public_users = express.Router();

const doesExist = (username) => {
    let usersWithSameName = users.filter((user) => {
        return user.username === username
    });
    if (usersWithSameName.length > 0) {
        return true;
    } else {
        return false;
    }
}

//Task 6  
//registering a new user
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!isValid(username, password)) {
        return res.status(404).json({ message: "Give valid username and password" });
    }

    if (username && password) {
        if (!doesExist(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: `User:${username} is successfully registered` });
        } else {
            return res.status(404).json({ message: `User:${username} already exists!` });
        }
    }
    else if (!username) {
        return res.status(404).json({ message: "Check username." });
    }
    else if (!password) {
        return res.status(404).json({ message: "Check password." });
    }
    else {
        return res.status(404).json({ message: "Unable to register!" });

    }
});

//Task 1
// Get the book list available in the shop
public_users.get('/', function (req, res) {
    const booklist = Object.values(books).map(item => item.title)
    return res.send(JSON.stringify(booklist, null, 4));
});

//Task10
// Get the book list available in the shop using axios async-await 
public_users.get('/axios', async function (req, res) {
    const author = req.params.author;
    try {
        const response = await axios.get('https://suhail56147-4000.theiadocker-3-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai')
        const allBooks = response.data;
        return res.send(allBooks);
    } catch (err) {
        console.error(err);
        return res.status(500).send("Error while fetching book details.");
    }
})



//Task 2
// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const bookdetail = books[isbn];
    if (bookdetail) {
        return res.send(JSON.stringify(bookdetail, null, 4));
    }
    else {
        return res.send(`There is no book with isbn ${isbn} `);
    }
});

//Task 11
//Get book details based on ISBN and promise with delay

public_users.get('/promise/isbn/:isbn', function (req, res) {
    let setDelay = new Promise((resolve, reject) => {
        console.log("wait for 5 seconds")
        setTimeout(function () {
            resolve("Promise is resolved.");
        }, 5000);
    })

    setDelay.then((success) => {
        console.log(success)
        const isbn = req.params.isbn;
        const bookdetail = books[isbn];
        if (bookdetail) {
            return res.send(JSON.stringify(bookdetail, null, 4));
        }
        else {
            return res.send(`There is no book with isbn ${isbn} `);
        }
    }).catch((err) => {
        res.send(err)
    })

});

//Task 3
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const allBooks = Object.values(books);
    let bookdetails = null;
    allBooks.forEach(element => {
        if (element["author"] === author) {
            bookdetails = element;
        }
    });

    if (bookdetails) {
        return res.send(bookdetails);
    }
    else {
        return res.send(` Book written by ${author} is not available`);
    }

});

//Task 12
// Get book details based on author using Promise
public_users.get('/promise/author/:author', async function (req, res) {
    const author = req.params.author;
    new Promise((resolve, reject) => {
        const allBooks = Object.values(books);
        let bookdetails = null;
        allBooks.forEach(element => {
            if (element["author"] === author) {
                bookdetails = element;
            }
        });
        if (bookdetails) {
            resolve(bookdetails);
        } else {
            reject(` Book written by ${author} is not available`);
        }
    })
        .then((success) => {
            console.log("Promise is resolved");
            res.send(JSON.stringify(success, null, 4));
        })
        .catch((err) => {
            res.send(err);
        });
}
);

//Task 4
// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const allBooks = Object.values(books);
    let bookdetails = null;
    allBooks.forEach(element => {
        if (element["title"] === title) {
            bookdetails = element;
        }
    });
    if (bookdetails) {
        return res.send(bookdetails);
    }
    else {
        return res.send(`There is no book available with title ${title} `);
    }
});

//Task 13
// Get all books based on title and using Promise
public_users.get('/promise/title/:title', function (req, res) {
    const title = req.params.title;
    const allBooks = Object.values(books);
    let bookdetails = null;

    const getDetailsFromTitle = new Promise((resolve, reject) => {
        allBooks.forEach((book) => {
            if (book.title === title) {
                bookDetails = book;
                resolve(bookDetails);
            }
        });
        reject(`There is no book available with title ${title} `);
    });

    getDetailsFromTitle
        .then((book) => {
            res.send(JSON.stringify(book, null, 4));
            console.log("Promise is resolved");

        })
        .catch((err) => {
            res.send(err);
            console.log("Promise is not resolved");
        });
});


//Task 5
//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const bookReview = books[isbn]["reviews"];
    return res.send(bookReview);
});

module.exports.general = public_users;
