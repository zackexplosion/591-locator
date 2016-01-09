"use strict";
const config = require('./config.json');
const CHANENEL = config.CHANENEL || "#test";
// check per 5 minutes
const CHECK_FREQ = parseInt(config.CHECK_FREQ) * 1000 || 1000 * 60 * 1;
const DEV = config.DEV || false;



console.log('CHANENEL : ', CHANENEL);
console.log('CHECK_FREQ : ', CHECK_FREQ , 'ms');
console.log('DEV : ', DEV);

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
  console.log('有新物件，傳送通知中', objects);
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
    // console.log(message);
    slack.webhook({
      // channel: "#test",
      channel: CHANENEL,
      username: "591",
      text: message
    }, function(err, response) {
      if(err){
        console.log(err);
      }
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
    if(DEV){
      if(i < 2){
        title = current.find('a').attr('title') + new Date();
      }
    }


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


// the runner
var runner = function(){
  let checker = function(){
    parse(API_ENDPOINT, (result)=>{
      // result = result.replace(/(\r\n|\n|\r)/gm,"");
      result = JSON.parse(result);

      let object = result.main;

      console.log('request done.');
      let objects = get_objects(result.main);


      // if new object found send notification
      if( typeof last_objects !== 'undefined'){
        let new_objects = [];
        for(var i in objects){
          if( typeof last_objects[i] === 'undefined'){
            new_objects.push(objects[i]);
          }
        }

        if( new_objects.length > 0){
          notification(new_objects);
        }
      }

      last_objects = objects;
      runner();
    });
  }
  setTimeout( checker, CHECK_FREQ);
}


// start runner
runner();

