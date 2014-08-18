var express = require('express');
var router = express.Router();
var _ = require('lodash');
var ArticleService = require('../services/ArticleService');
var dirty = require('dirty');
var Q = require('q');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/blurrent');



/* GET home page. */
router.get('/', function(req, res) {

  
  ArticleService.getRandom(16, 'general')
  .then(function(articles) {
    res.render('index', {
      title: 'Blurrent - The Best News Site On The Internet', 
      sliderArticles: [articles[0],articles[1],articles[2]], 
      blockArticles: [articles[3],articles[4],articles[5]], 
      topNews: [articles[6], articles[7], articles[8], articles[9], articles[10], articles[11]],
      rightArticles: _.last(articles,4) 
    });
  });
});

router.get('/nerdy', function(req, res) {

  ArticleService.getRandom(16, 'nerdy')
  .then(function(articles) {
    res.render('index', {
      title: 'Blurrent: Nerdy - The Best Nerdy News Site On The Internet', 
      sliderArticles: [articles[0],articles[1],articles[2]], 
      blockArticles: [articles[3],articles[4],articles[5]], 
      topNews: [articles[6], articles[7], articles[8], articles[9], articles[10], articles[11]],
      rightArticles: _.last(articles,4) 
    });
  });
});

router.get('/article/:id', function(req, res) {
  console.log('article');
    ArticleService.get(req.params.id).then(function(article) {
      ArticleService.getRandom(6,article.tags[0])
      .then(function(articles) {
        console.log('articles:', articles);
        res.render('article', { title: article.title, article: article, navArticles: _.first(articles,2), rightArticles: _.last(articles,4) });
      });
    });
});

module.exports = router;
