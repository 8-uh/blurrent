var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  title: String,
  slug: String,
  bullets: Array,
  cardId: String,
  author: String,
  created: Date,
  hidden: Boolean,
  tags: Array,
  image: Object,
  topic: String,
  meta: {
    nsfw: Boolean,
    votes: Number,
    faves: Number
  }
});

ArticleSchema.statics.random = function(callback) {
  this.count(function(err, count) {
    if (err) {
      return callback(err);
    }
    var rand = Math.floor(Math.random() * count);
    this.findOne().skip(rand).exec(callback);
  }.bind(this));
};

module.exports = mongoose.model('Article', ArticleSchema);