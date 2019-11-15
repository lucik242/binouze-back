const mongoose = require('mongoose')

const Schema = mongoose.Schema

const phoneSchema = new Schema({
        name: String,
        type: String,
        price: Number,
        rating: Number,
        warranty_years: Number,
       available : Boolean
})

module.exports = mongoose.model('phone', phoneSchema)


