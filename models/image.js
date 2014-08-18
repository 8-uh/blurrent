var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ImageSchema = new Schema({
  name: String,
  files: Array,
  cardId: String
});

module.exports = mongoose.model('Image', ImageSchema);