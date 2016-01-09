"use strict";
const API_ENDPOINT = 'http://rent.591.com.tw/index.php?module=search&action=rslist&is_new_list=1&type=1&searchtype=1&region=3&listview=img&rentprice=,20000&area=10,&floor=,1&order=posttime&orderType=desc';
const WEB_HOOK_API = 'https://hooks.slack.com/services/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';
const WEB_BASE_URI = 'http://www.591.com.tw/';
const
  request = require('request'),
  cheerio = require('cheerio'),
  Slack = require('slack-node');
  // $ = require('jquery');

const slack = new Slack();
slack.setWebhook(WEB_HOOK_API);



// functions
const parse = function (url, callback) {
  console.log('start request', new Date());
  request(url, function (error, response, body) {

    callback(body);
    // let result;
    // result = JSON.parse(body);
    // callback(result);

    // console.log(response);



    // $('.question-summary .question-hyperlink').each(function () {
    //     console.info($(this).text());
    // });
  })
}
var last_result;
var check_freq = 1000;

var notification = function(message){
  console.log('有新物件，傳送通知中');
  slack.webhook({
    channel: "#test",
    username: "591",
    text: message
  }, function(err, response) {
    // console.log(response);
  });
}

var get_objects = function(main){
  // console.log(main);
  var objects = [];
  let $ = cheerio.load(main, {
    decodeEntities: false
  });

  let node = $('.shList');

  for(var i = 0; i < node.length; i++){
    let current = $(node.get(i));
    objects.push({
      link: WEB_BASE_URI + current.find('a').attr('href'),
      title: current.find('a').attr('title'),
      address: current.find('p:nth-child(2)').text(),
      price: current.find('.price strong').text()
    });
  }

  console.log(objects);
}


// the runner
var checker = function(){
  setTimeout(()=>{
    parse(API_ENDPOINT, (result)=>{
      result = JSON.parse(result);

      var object = result.main;

      // *************************
      // ***** ONLY for test *****
      // *************************
      object += 'hello' + new Date();

      console.log('request done.');
      var objects = get_objects(result.main);

      if( typeof last_result !== 'undefined' && last_result !== object){
        var new_objects = [];
        notification(new_objects);
      }

      last_result = result.main;
      // checker();
    });
  }, check_freq);
}


// start checker
checker();

