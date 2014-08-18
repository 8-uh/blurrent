var express = require('express');
var router = express.Router();
var _ = require('lodash');
var ArticleService = require('../services/ArticleService');
var dirty = require('dirty');
var Q = require('q');
var mongoose = require('mongoose');

mongoose.connect(process.env.MONGOLAB_URI, function(err) {
  if(err) {
    throw(err);
  } else {
    console.log('connected to mongo');
  }
});



/* GET home page. */
router.get('/', function(req, res) {

  
  ArticleService.getRandom(16, 'general')
  .then(function(articles) {
    res.render('index', {
      title: 'Blurrent - The Best News Site On The Internet',
      metaImage: '', 
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
      metaImage: '',
      sliderArticles: [articles[0],articles[1],articles[2]], 
      blockArticles: [articles[3],articles[4],articles[5]], 
      topNews: [articles[6], articles[7], articles[8], articles[9], articles[10], articles[11]],
      rightArticles: _.last(articles,4) 
    });
  });
});

router.get('/nsfw', function(req, res) {

  ArticleService.getRandom(16, 'nsfw')
  .then(function(articles) {
    console.log('nsfw articles length:', articles.length);
    console.log(articles);
    res.render('index', {
      title: 'Blurrent: NSFW - The Weirdest News Site On The Internet', 
      metaImage: '',
      sliderArticles: [articles[0],articles[1],articles[2]], 
      blockArticles: [articles[3],articles[4],articles[5]], 
      topNews: [articles[6], articles[7], articles[8], articles[9], articles[10], articles[11]],
      rightArticles: _.last(articles,4) 
    });
  });
});

router.get('/article/:id', function(req, res) {
    ArticleService.get(req.params.id).then(function(article) {
      ArticleService.getRandom(6,article.tags[0])
      .then(function(articles) {
        res.render('article', { title: article.title, 
          article: article, 
          metaImage: article.image.link,
          navArticles: _.first(articles,2), 
          rightArticles: _.last(articles,4) });
      });
    });
});

router.put('/markNSFW/:id', function(req, res) {
  ArticleService.get(req.params.id).then(function(article) {
    article.tags = ['nsfw'];
    console.log('marking:', req.params.id,'as NSFW');
    article.save(function(err) {
      res.send('ok');
    });
  });
});

module.exports = router;
