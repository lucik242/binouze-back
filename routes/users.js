const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require ('bcryptjs');
const config = require ('config');
const jwt = require('jsonwebtoken');
// const fs = require("fs");

//for connect db
 const mongoose = require("mongoose");
let db = config.get('mongoURI');
mongoose.connect(db, {
 useNewUrlParser: true,
 useCreateIndex: true }, err => {
 if (err) {
  console.log("Error!! " + err);
 } else {
  console.log("Connected mongodb");
 }
});

//route  POST /users
// desc Register new user
router.post('/users', (req, res) =>{
 const {name, email, password } = req.body;

 //validation
 if (!name || !email || !password) {
   return res.status(400).json({msg: 'Please entrer all fields'});
 }

 // Check for existing user
 User.findOne({ email })
   .then(user =>{
      if(user)  return res.status(400).json({msg: 'User already exist' });

      const newUser = new User({
       name,
       email,
       password
      });

      // Create salt and hash
      bcrypt.genSalt(10, (err, salt) =>{
       bcrypt.hash( newUser.password, salt, (err, hash) =>{
         if (err) throw err;
         newUser.password = hash;
         newUser.save()
           .then(user => {

              jwt.sign(
               { id: user.id },
               config.get('jwtSecret'),
               //time to expire connection (3600 = 1h)
               {expiresIn: 3600},
               (err, token) => {
                if(err) throw err;
                res.json({
                 token,
                 user: {
                  id: user.id,
                  name: user.name,
                  email: user.email
                 }
               }); 
                
               })
           })
       })
      })
   })
});





module.exports = router;
