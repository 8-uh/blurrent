var express = require('express');
var router = express.Router();
var _ = require('lodash');
var cards = require('../utils/CardsDB');
var BulletPoint = require('../utils/BulletPoint');

var imageSearch = require('../utils/ImageSearch');

var utils = require('util');


/* GET home page. */
router.get('/', function(req, res) {
  var numberOfBullets = Math.ceil(Math.random() * 20) + 10;
  var numberOfPages = Math.ceil(numberOfBullets / 10);
  var topic = cards.getRandomAnswer();
  console.log('bullets:',numberOfBullets, 'pages:',numberOfPages);
  var questions = cards.getQuestions(numberOfBullets);
  
  imageSearch.dummyImages(topic.text, numberOfPages)
  .then(function(images) { 
    console.log('images returned:',images.length);
    var bullets = _.map(_.range(0, numberOfBullets), function(index) {
      var question = questions[index];
      var bulletPoint = new BulletPoint(question, topic, images[index]);
      bulletPoint.print();
      return bulletPoint;
    });
    var title = bullets.length + ' things you might not know about ' + topic.text;
    console.log(title,bullets.length);
    res.render('index', { title: title , bullets: bullets });
  });

});

module.exports = router;
