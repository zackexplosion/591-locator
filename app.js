"use strict";
const API_ENDPOINT = 'http://rent.591.com.tw/index.php?module=search&action=rslist&is_new_list=1&type=1&searchtype=1&region=3&listview=img&rentprice=,20000&area=10,&floor=,1&order=posttime&orderType=desc';
const
  express = require('express'),
  app = express(),
  request = require('request'),
  cheerio = require('cheerio');

const parse = function (url, callback) {
  request(url, function (error, response, body) {
    console.log(typeof body);

    let result;
    // result = decodeURIComponent(body);
    result = JSON.parse(body)
    // console.log(result);
    // let $ = cheerio.load(body);
    // let result = body;
    callback(result);
    // console.log(response);



    // $('.question-summary .question-hyperlink').each(function () {
    //     console.info($(this).text());
    // });
  })
}



app.set('view engine', 'jade');
app.get('/', function (req, res) {
  parse(API_ENDPOINT, function (response) {
    // res.send(response);
    res.render('index', response);
  });
});

var server = app.listen(5911, function () {
  var host = server.address().address;
  var port = server.address().port;
  parse(API_ENDPOINT, () => { });
  console.log('Example app listening at http://%s:%s', host, port);
});

// function parse(url) {
//   request(url, function (error, response, body) {
//     console.log(response);

//       // $ = cheerio.load(body);

//     // $('.question-summary .question-hyperlink').each(function () {
//     //     console.info($(this).text());
//     // });
//   })
// }

