const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth')
// const fs = require("fs");

//for connect db
const mongoose = require("mongoose");
// const mongoose = config.get('mongoURI');
// let db = "mongodb://localhost:27017/produits_db";
let db = config.get('mongoURI');
mongoose.connect(db, {
 useNewUrlParser: true,
 useCreateIndex: true
}, err => {
 if (err) {
  console.log("Error!! " + err);
 } else {
  console.log("Connected mongodb");
 }
});

//route  POST /auth
// desc Auth user
router.post('/', (req, res) => {
 const { email, password } = req.body;

 //validation
 if ( !email || !password) {
  return res.status(400).json({ msg: 'Please entrer all fields' });
 }

 // Check for existing user
 User.findOne({ email })
  .then(user => {
   //if no user
   if (!user) return res.status(400).json({ msg: 'User Does not exist' });
   
   //Validate password
   bcrypt.compare(password, user.password)
      .then(isMatch => {
       // if it is not match
       if (!isMatch) return res.status(400).json({ msg:'Invalid credentials' });
       jwt.sign(
        { id: user.id },
        config.get('jwtSecret'),
        //time to expire connection (3600 = 1h)
        { expiresIn: 3600 },
        (err, token) => {
         if (err) throw err;
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
});

 // @route   GET auth/user
 // @desc   Get user data
 // @access  Private
 router.get('/user', auth, (req, res) => {
    User.findById(req.user.id)
        .select( '-password')
        .then(user => res.json(user))
 });
  





module.exports = router;