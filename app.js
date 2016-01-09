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
  })
}

const notification = function(objects){

  for(let i in objects){
    var c = objects[i];
    let message = '';
    message += ' *發現有新房子，快來看看喔！*' + "\n" ;
    message +=  new Date() + "\n" ;
    message += c.link + "\n" ;
    message += '• ' + c.title + "\n" ;
    message += '• ' + c.address  + "\n";
    message += '• ' + c.price  + "\n";
    message += '• ' + c.size + "\n";
    // message += '--------------------' + "\n";
    slack.webhook({
      channel: "#general",
      username: "591",
      text: message
    }, function(err, response) {
      // console.log(response);
    });
  }
}


const get_objects = function(main){
  // console.log(main);
  let objects = {};
  let $ = cheerio.load(main, {
    decodeEntities: false
  });

  let node = $('.shList');

  for(let i = 0; i < node.length; i++){
    let current = $(node.get(i));
    let title = current.find('a').attr('title');

    // *************************
    // ***** ONLY for test *****
    // *************************

    // if(i < 2){
    //   title = current.find('a').attr('title') + new Date();
    // }


    objects[title] = {
      link: WEB_BASE_URI + current.find('a').attr('href'),
      title: current.find('a').attr('title'),
      address: current.find('p:nth-child(2)').text(),
      price: current.find('.price strong').text(),
      size: current.find('.rentByArea').text().replace(/(\r\n|\n|\r|\t)/gm,"").trim()
    }
  }

  // console.log(objects);
  return objects;
}

var last_objects;
// check per 5 minutes
var check_freq = 1000 * 60 * 5;

// the runner
var checker = function(){
  setTimeout(()=>{
    parse(API_ENDPOINT, (result)=>{
      // result = result.replace(/(\r\n|\n|\r)/gm,"");
      result = JSON.parse(result);

      let object = result.main;

      console.log('request done.');
      let objects = get_objects(result.main);

      if( typeof last_objects !== 'undefined' && JSON.stringify(last_objects) !== JSON.stringify(object) ){
        let new_objects = [];
        for(var i in objects){
          if( typeof last_objects[i] === 'undefined'){
            new_objects.push(objects[i]);
          }
        }
        console.log('有新物件，傳送通知中');
        notification(new_objects);
      }

      last_objects = objects;
      checker();
    });
  }, check_freq);
}


// start checker
checker();

