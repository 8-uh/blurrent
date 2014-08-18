var mongoose = require('mongoose');
var Q = require('q');
var ProgressBar = require('progress');
var _ = require('lodash');
var slang = require('slang');
var Card = require('../models/card');
var Image = require('../models/image');
var Article = require('../models/article');
var BulletPoint = require('../utils/BulletPoint');



var MAX_BULLETS = 29;
var MIN_BULLETS = 7;
var ADJECTIVES = [
  'Cringeworthy',
  'Unbelievable',
  'Underrated',
  'Intriguing',
  'Amazingly Fantastic',
  'Gruesome',
  'Insanely Insane',
  'Most Adorable',
  'Unexpected'
];

var WHITE_NOUNS = [
  'Clues',
  'Hints',
  'Ways',
  'Signs',
  'Reasons'
];

var GREY_NOUNS = [
  'Facts',
  'Things',
  'Moments',
  'Items'
];


var WHITE_LINKERS = [
  'You\'re',
  'Your Mom Is',
  'The President Is',
  'Jesus Was',
  'Your Cat Is'
];

var GREY_LINKERS = [
  'That You Didn\'t Know About',
  'That Will Make You Hate',
  'That Are Less Cool Than',
  'That Exemplify',
  'That Make Fun Of',
  'About'
];

mongoose.connect(MONGOLABS_URI, function(err) {
  !!err ? console.log('errror connecting:', err) : null;

  Card.find({type: 'A', tags: 'general' },function(err, cards) {
    var bar = new ProgressBar(':bar :current/:total :percent', { total: cards.length});
    Card.find({type: 'Q', tags: 'general'}, function(e, qcards) {
      cards.forEach(function(card) {
        var article = new Article();
        article.topic = card.text;
        article.cardId = card._id;

        var numberOfBullets = Math.floor(Math.random() * (MAX_BULLETS-MIN_BULLETS)) + MIN_BULLETS;
        var qs = _.first(_.shuffle(qcards), numberOfBullets+1);

        // create article title
        var adjDice = Math.floor(Math.random() * 5)  + Math.floor(Math.random() * 5);
        var adjective = ADJECTIVES[adjDice];

        
        var wheel = Math.floor(Math.random() * 9);
        var noun, linker;
        if(wheel >= 5) {
          noun = GREY_NOUNS[wheel-5];
          linker = GREY_LINKERS[Math.floor(Math.random() * 5)];

        } else {
          noun = WHITE_NOUNS[wheel];
          linker = WHITE_LINKERS[Math.floor(Math.random() * 5)];
        }
        var title = numberOfBullets + ' ' + adjective + ' ' + noun + ' ' + linker + ' ' + card.text;
        article.title = title;

        // get images for the current card
        Image.findOne({cardId: card._id}, function(err, image) {
          
          article.image = image.files[0];
          article.bullets = _.map(_.range(0,numberOfBullets), function(index) {
            var answers = [article.topic];
            while(qs[index].numAnswers > answers.length) {
              answers.push(_.sample(cards).text);
            }
            var bulletPoint = new BulletPoint(qs[index], answers, image.files[index+1] );
            return bulletPoint;
          });
          
          article.slug = slang.dasherize(article.title);
          article.hidden = false;
          article.created = new Date();
          article.tags.push('general');
          article.save(function(err) {
            if(err) { 
              throw(err);
            }
            bar.tick();
          });
        });

      });
    });
  });
});



