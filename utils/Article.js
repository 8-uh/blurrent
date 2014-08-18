var imageService = require('../utils/ImageService');
var cards = require('../utils/CardsDB');
var BulletPoint = require('../utils/BulletPoint');
var _ = require('lodash');
var Q = require('q');
var slang = require('slang');
var dirty = require('dirty');
var articles = dirty('articles.json');

var Article = function() {
  this.slug = null;
  this.title = null;
  this.bullets = null;
  this.image = null;
  this.author = 'Jeremy Dowell';
  this.tagline = 'Proin pharetra, ante quis sollicitudin sollicitudin, est sapien mollis mi, ac viverra purus nibh a urna. Suspendisse non tincidunt velit, vel vestibulum turpis.'
  this.date = null;
  this.topic = null;
};


var ArticleService = function() {};

ArticleService.get = function(slug) {

    var deferred = Q.defer();
    var article;
    if(slug) {
      article = articles.get(slug);
    }
    if(article) {
      deferred.resolve(article);
    }  else {
      article = new Article();
      var numberOfBullets = Math.ceil(Math.random() * 20) + 10;
      article.topic = cards.getRandomAnswer();

      var questions = cards.getQuestions(numberOfBullets);
      
      
      imageService.dummyImages(article.topic.text, numberOfBullets)
      .then(function(images) { 
        article.image = images[0];
        article.bullets = _.map(_.range(0, numberOfBullets), function(index) {
          var bulletPoint = new BulletPoint(questions[index], article.topic, images[index+1]);
          return bulletPoint;
        });
        article.title = article.bullets.length + ' Things You Might Not Know About ' + slang.capitalizeWords(article.topic.text);
        article.slug = slang.dasherize(article.title.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g,""));
        //console.log('article generated:', article);
        articles.set(article.slug, article);
        deferred.resolve(article);
      });
    }

    return deferred.promise;
};

ArticleService.getRandom = function(numArticles) {
  var articleList = [];
  articles.forEach(function(key, value) {
    articleList.push(value);
  });
  console.log('got all articles:', articleList.length);
  if(articleList.length < numArticles) {
    return articleList;
  } 
  return _.first(_.shuffle(articleList),numArticles);
};

module.exports = ArticleService;