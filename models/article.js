const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const articleSchema = new Schema({
	name: String,
	type: String,
	price: String,
	rating: String,
	description: String,
	file: String,
 available: Boolean
});

module.exports = mongoose.model("article", articleSchema);
