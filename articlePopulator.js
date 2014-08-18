var mongoose = require('mongoose');
var Q = require('q');
var ProgressBar = require('progress');
var _ = require('lodash');

var ImageService = require('./Services/ImageService');
var Card = require('./models/card');



mongoose.connect('mongodb://localhost:27017/blurrent', function(err) {
  !!err ? console.log('errror connecting:', err) : null;
  Card.find({type: 'A' },function(err, cards) {
    var cardCount = 0;
    var bar = new ProgressBar(':bar :current/:total :percent', { total: cards.length});

    function getImages(card) {
      var que = [];
      for(var i = 0; i < 3; i++) {
        que.push(ImageService.$get(card.text, (i * 10) + 1));
      }
      Q.all(que).then(function(imgs) {
        var image = new Image();
        image.name = card.text;
        image.cardId = card._id;
        image.files = _.flatten(imgs);
        image.save(function(err) { 
          if(err) {
            throw err;
          } 
          bar.tick();
        });
      });
      
    }
    
    function nextCard() {
      var card = cards[cardCount];
      cardCount++;
      Image.findOne({cardId: card._id}, function(err, image) {
        if(err) { throw(err); }
        if(image) {
          bar.tick();
          if(cardCount < cards.length) {
            nextCard();
          }
        } else {
          getImages(card);
          if(cardCount < cards.length) {
            setTimeout(nextCard, 1000);
          }
        }
      });
    }

    nextCard();
  });
});


