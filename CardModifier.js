var mongoose = require('mongoose');
var Q = require('q');
var ProgressBar = require('progress');
var Card = require('./models/card');
var _ = require('lodash');

var NERDY_EXPANSIONS = [
    'CAHweeaboo',
    'PAXP13',
    'PAXE13',
    'Gallifrey',
    'GOT',
    'HACK1'
];





mongoose.connect('mongodb://localhost:27017/blurrent', function(err) {
  !!err ? console.log('errror connecting:', err) : null;
  console.log('connected');

  /*
  Card.find({$or:[
    {expansion: {'$ne': 'CAHweeaboo'}},
    {expansion: {'$ne':'PAXP13'}},
    {expansion:{'$ne':'PAXE13'}},
    {expansion:{'$ne':'Gallifrey'}},
    {expansion:{'$ne':'GOT'}},
    {expansion:{'$ne':'HACK1'}},
    ]},function(err, cards) {
      var bar = new ProgressBar(':bar :current/:total :percent', { total: cards.length});
      cards.forEach(function(card) {
        console.log('modifying card:', card);
        card.tags.push('general');
        card.save(function(err) {
          if(err) {
            throw(err);
          }
          bar.tick();
        });
      });
    });
  */
 

  //remove tags
   Card.find(function(err, cards) {
      var bar = new ProgressBar(':bar :current/:total :percent', { total: cards.length});
      cards.forEach(function(card) {
        card.tags = [];
        card.save(function(err) {
          if(err) {
            throw(err);
          }
          bar.tick();
        });
      });
    });

   // add tags
   Card.find(function(err, cards) {
      var bar = new ProgressBar(':bar :current/:total :percent', { total: cards.length});
      cards.forEach(function(card) {
        if(_.contains(NERDY_EXPANSIONS,card.expansion)) {
          card.tags.push('nerdy');
        } else {
          card.tags.push('general');
        }
        card.save(function(err) {
          if(err) {
            throw(err);
          }
          bar.tick();
        });
      });
    });
});



