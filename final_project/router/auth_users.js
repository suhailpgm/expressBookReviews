const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{"username":"shamil","password" :"p1234"},{"username":"sanjay","password" :"p2345"}];

const alreadyLoggedIn = (username, loggedUser) => {
    if (loggedUser === username) {
        return true;
    }
    else
        return false;
}

const isValid = (username, password) => {
    if (!username || !password) {
        return false;
    }
    else
        return true;
}

const authenticatedUser = (username, password) => {
    let authenticatedUsers = users.filter((user) => {
        return (user.username === username && user.password === password)
    });
    if (authenticatedUsers.length > 0) {
        return true;
    }
    else {
        return false;
    }
}

//Task 7
//only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!isValid(username, password)) {
        return res.status(404).json({ message: "Give valid username and password" });
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send(`User ${username} successfully logged in`);
    } else {
        return res.status(208).json({ message: "Login failed. Check username and password" });
    }
});

//Task 8
// Adding or Modifying  book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.reviews;
    const username = req.session.authorization.username

    if (books[isbn]) {
        let bookReviews = books[isbn].reviews
        let currentUserReviews = bookReviews.filter((review) => review.username === username);
        if (currentUserReviews.length > 0) {
            let reviewUpdate = currentUserReviews[0];
            reviewUpdate.review = review;
            bookReviews = bookReviews.filter((review) => review.username != username);
            bookReviews.push(reviewUpdate);
        } else {
            books[isbn].reviews.push({ "username": username, "review": review });
        }
    } else {
        return res.send(`Book with ISBN number : ${isbn} is not exists `)
    }
    return res.send(books[isbn]["reviews"]);
});

regd_users.delete("/auth/review/:isbn",(req,res)=>{
    const isbn = req.params.isbn;
    const review = req.body.reviews;
    const username = req.session.authorization.username
    let hasReview= false;
    if (books[isbn]) {
        let bookReviews = books[isbn].reviews
        console.log(bookReviews);

        Object.values(bookReviews).forEach(element => {
            if (element["username"] === username) {
              delete bookReviews[element];
              hasReview =true ;     
            }
        }); 
          if (!hasReview) {
            res.send("There is no deletable reviews for this");
          }else{
            return res.send(`Review added by user ${username} is deleted`);
          }
    } else {
        return res.send(`Book with ISBN number : ${isbn} is not exists `)
    }
    

})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
