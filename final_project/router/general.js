const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }

//Task 6  
//registering a new user
public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!doesExist(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: `User:${username} is successfully registered`});
      } else {
        return res.status(404).json({message: `User:${username} already exists!`});    
      }
    }
    else if(!username){
        return res.status(404).json({message: "Check username."});
    }
    else if(!password){
        return res.status(404).json({message: "Check password."});
    }
    else{
        return res.status(404).json({message: "Unable to register!"});

    }
  });
  
//Task 1
// Get the book list available in the shop
public_users.get('/',function (req, res) {
  const booklist=Object.values(books).map(item => item.title)
  return res.send(JSON.stringify(booklist,null,4));
});

//Task 2
// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn=req.params.isbn;
  const bookdetail=books[isbn];
  return res.send(JSON.stringify(bookdetail,null,4));
 });

//Task 3
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author=req.params.author;
  const allBooks = Object.values(books);
  let bookdetails=null;
  allBooks.forEach(element => {
      if(element["author"]===author){
          bookdetails=element;
      }         
  });
  

  return res.send(bookdetails);
});

//Task 4
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title=req.params.title;
  const allBooks = Object.values(books);
  let bookdetails=null;
  allBooks.forEach(element => {
      if(element["title"]===title){
          bookdetails=element;
      }         
  });
  return res.send(bookdetails);
});

//Task 5
//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn=req.params.isbn;
  const bookReview=books[isbn]["reviews"];
  return res.send(bookReview);
});

module.exports.general = public_users;
