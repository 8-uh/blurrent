var mongoose = require('mongoose');
var Q = require('q');
var slang = require('slang');
var ProgressBar = require('progress');

var CardList = require('./utils/CardList');
var Card = require('./models/card');

var bar = new ProgressBar(':bar', { total: CardList.length});

mongoose.connect('mongodb://localhost:27017/blurrent', function(err) {
  !!err ? console.log('errror connecting:', err) : null;
  CardList.forEach(function(c) {
    var card = new Card();
    card.text = c.text;
    card.numAnswers = c.numAnswers;
    card.type = c.cardType;
    card.expansion = c.expansion;
    card.save(function(err) {
      if(err) {
        throw err;
      } else {
        bar.tick();
      }
    });
  });
});

