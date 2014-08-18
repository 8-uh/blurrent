var express = require('express');
var router = express.Router();
var _ = require('lodash');
var ArticleService = require('../utils/Article');
var dirty = require('dirty');
var Q = require('q');



/* GET home page. */
router.get('/', function(req, res) {

  Q.all([
    ArticleService.getRandom(3),
    ArticleService.get(),
    ArticleService.get(),
    ArticleService.get()
    ])
  .then(function(articles) {
    res.render('index', {title: 'Site Title', sliderArticles: articles[0], articles: [articles[1],articles[2],articles[3]]});
  });
});

router.get('/article/:id', function(req, res) {
  console.log('article');
  article = ArticleService.get(req.params.id)
  .then(function(article) {
    res.render('article', { title: article.title, article: article });
  });
});

module.exports = router;
