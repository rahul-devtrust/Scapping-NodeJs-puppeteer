var express = require('express');
var router = express.Router();
var facebookController = require('../controllers/facebook')
var fbKeywordController = require('../controllers/fbkeyword')
var youtubeController = require('../controllers/youtube')
var instaAccountController = require('../controllers/instaaccount')
var instahashtagController = require('../controllers/instahastag')
var YoutubeChannel = require('../controllers/youtubeChannel')

//to check api 
router.get('/', (req, res) => {
    res.send('api version 1.0 running');
});

//hastag search
router.get('/hashtag', facebookController.fbHasTag);

//keyword search
router.get('/keyword', fbKeywordController.fbKeyWord);

//youtube trending
router.get('/youtube', youtubeController.trend);

//youtube channel
router.get('/youtubechannel', YoutubeChannel.checkFilter, YoutubeChannel.channel);


//check sequlize 
//router.get('/', facebookController.findAll);

//Instagram account search
router.get('/instaaccount', instaAccountController.instaAccount);

//Instagram hashtag search
router.get('/instatag', instahashtagController.instahashtag);
module.exports = router;
