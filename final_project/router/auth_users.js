const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//Task 7
//only registered users can login
regd_users.post("/login", (req,res) => {
  return res.status(300).json({message: "Yet to be implemented"});
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
  
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
  
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send(`User ${username} successfully logged in`);
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
  });

//Task 8
// Adding or Modifying  book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn=req.params.isbn;
  const review=req.body.reviews;
  const username=req.session.authorization.username
  
  if(books[isbn]){
    let bookReviews=books[isbn].reviews
      let currentUserReviews= bookReviews.filter((review) => review.username === username);
      if(currentUserReviews.length>0){
           let reviewUpdate = currentUserReviews[0];
           reviewUpdate.review=review;
           bookReviews = bookReviews.filter((review) => review.username != username);
           bookReviews.push(reviewUpdate);
      } else {
           books[isbn].reviews.push({"username" : username ,"review" : review});
      }
    }else{
        return res.send(`Book with ISBN number : ${isbn} is not exists `)
    }
  return res.send(books[isbn]["reviews"]);
});

module.exports.authenticated = regd_users;
// module.exports.isValid = isValid;
module.exports.users = users;
