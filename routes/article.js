const express = require("express");
const router = express.Router();
const Article = require("../models/article");
const multer = require("multer");
const config = require('config');
const fs = require("fs");

//for connect db
const mongoose = require("mongoose");
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

// SET STORAGE
var storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, "uploads");
	},
	filename: function(req, file, cb) {
		cb(null, Date.now() + "-" + file.originalname);
	}
});

var upload = multer({ storage: storage });


// Add article START ************
router.post("/addArticle", upload.single("file"), (req, res, next) => {
	// console.log("req.body: ", req.body);
	console.log("req.body: ", req.body);
	console.log("req.file: ", req.file);

	let article = new Article();
	article.name = req.body.name;
	article.type = req.body.type;
	article.price = req.body.price;
	article.rating = req.body.rating;
	article.description = req.body.description;
	article.available = req.body.available;
	article.file = req.file.path;

	article.save((error, addArticle) => {
		if (error) {
			console.log(error);
		} else {
			console.log(addArticle, +"icicicici");
			res.status(200).send(addArticle);
		}
	});
});

// Add article END ************

// All article START
router.get("/allArticle", (req, res) => {
	Article.find((error, allArticle) => {
		if (error) {
			console.log(error);
			res.status(500).send(error);
		} else {
			console.log(allArticle);
			res.status(200).send(allArticle);
		}
	});
});
// All article END

// Update article START
router.put("/modifArticle/", (req, res) => {
	Article.findById(req.body.id, (error, article) => {
		if (error) {
			console.log(error);
			res.status(500).send(error);
		} else {
			console.log(req.body);
			article.name = req.body.name;
			article.type = req.body.type;
			article.price = req.body.price;
			article.rating = req.body.rating;
			article.description = req.body.description;
			article.available = req.body.available;
			console.log(article);

			article.save(error => {
				if (error) {
					console.log(error);
				} else {
					console.log(article);
					res.send(200);
				}
			});
		}
	});
});

// Update article END

//Delete article START
router.delete("/deleteArticle/:id", (req, res) => {
	Article.deleteOne({ _id: req.params.id }, (err, article) => {
		if (err) {
			console.log(err);
			res.send(err);
		} else {
			console.log(article);
			res.send("utilisateur supprimé avec succés");
		}
	});
});

//Delete article END

module.exports = router;
