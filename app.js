//import express
const express = require('express');
const app = express();

// import morgan package
const morgan = require('morgan');

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});


//use it
app.use(morgan('dev'));
// Routes which should handle request

// import body-parser
const bodyParser = require('body-parser');
// let's use it
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());




var Twitter = require('twitter');
  var client = new Twitter({
    consumer_key: 'WGL9K1LrehbP2HzQzdBel82Tr',
    consumer_secret: 'UOYFRCNCK3i113LsIaqyFtWaSTsS2MQx2wh6hNYZY95AQyPPE7',
    access_token_key: '933883998065053698-b7mKHp82t1vgEYHOswNlgcYuOU2VPqV',
    access_token_secret: '3WjjbPcKn96d8edAquejNkGsjwV7rveNyW64vSVWI6afV',
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
  });

  //https://gnip-stream.twitter.com/stream/powertrack/accounts/:account_name/publishers/twitter/:stream_label.json
  
  var Sentiment = require('sentiment');
  app.get("/orders", (req, res, next) => {
  var sentiment = new Sentiment();
  //var result = sentiment.analyze('Cats are stupid.');
  //console.dir(result);    // Score: -2, Comparative: -0.666
  var search_param = req.query.search_param
  var params = {screen_name: 'nodejs'};
  client.get('search/tweets', {q:search_param , lang: 'en', count:10, result_type:'recent'}, function(error, tweets, response) {
    //console.log(tweets);
    //console.log(tweets.statuses.map(item=>{return(item.text)}));
    console.log(tweets);
    if (tweets.statuses!=undefined){
    var sentiment_score = ((tweets.statuses.map(item=>{return((sentiment.analyze(item.text).score))})).reduce((a, b) => a + b, 0));
    var favorite_count = ((tweets.statuses.map(item=>{return((item.favorite_count))})).reduce((a, b) => a + b, 0));
    var retweet_count = ((tweets.statuses.map(item=>{return((item.retweet_count))})).reduce((a, b) => a + b, 0));
    }
    //console.log(tweets.statuses.map(item=>{return(item.lang)}));
    //console.log(tweets.favorite_count)
    res.json([sentiment_score,favorite_count,retweet_count])
    //sentiment analysis -----
    //negative - bad sentiment
    //double digits - good
    //triple digits - highly loved

    //retweet and favorite count ----
    //single units - consant demand. 
    //double units - triple - medium demand.
    //over three units - high demand.
 });
});

//export app
module.exports = app;