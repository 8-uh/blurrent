var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CardSchema = new Schema({
  text: String,
  numAnswers: Number,
  type: String,
  expansion: String,
  tags: Array
});

module.exports = mongoose.model('Card', CardSchema);