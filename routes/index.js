var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('login', { title: 'boostChat - Sign In'});
});

router.get('/login', function (req, res, next) {
    res.render('login', { title: 'boostChat - Sign In'});
});

router.get('/chat', function (req, res, next) {
  res.render('chat', { title: 'boostChat' });
});

module.exports = router;
