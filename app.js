"use strict"
// logger
const log4js = require('log4js')
const logger = log4js.getLogger()

const config = require('./config.json');
const CHANENEL = config.CHANENEL || "#test";

// check per 5 minutes
const CHECK_FREQ = parseInt(config.CHECK_FREQ) * 1000 || 1000 * 60 * 1;
const DEV = config.DEV || false;

var API_ENDPOINT = config.API_ENDPOINT
const WEB_HOOK_API = config.WEB_HOOK_API
const WEB_BASE_URI = 'http://www.591.com.tw/'


const
  process = require('process'),
  request = require('request'),
  cheerio = require('cheerio'),
  Slack = require('slack-node');
  // $ = require('jquery');

if(process.argv[2]){
  API_ENDPOINT = process.argv[2];
  // let api = process.argv[2].split('=');
  // if( api[0] === 'API'){
  //   API_ENDPOINT = api[1];
  // }
}

logger.info('CHANENEL : ', CHANENEL);
logger.info('CHECK_FREQ : ', CHECK_FREQ , 'ms');
logger.info('API_ENDPOINT : ', API_ENDPOINT);
logger.info('SLACK_WEB_HOOK_API : ', WEB_HOOK_API);
logger.info('DEV : ', DEV);

const slack = new Slack();
slack.setWebhook(WEB_HOOK_API);

// functions
const parse = function (url, callback) {
  request(url, function (error, response, body) {
    if(error){
      logger.error(error)
    }
    callback(body)
  })
}

const notification = function(objects){

  logger.info('有新物件，傳送通知中', objects)

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
    // logger.info(message);
    slack.webhook({
      // channel: "#test",
      channel: CHANENEL,
      username: "591",
      text: message
    }, function(err, response) {
      if(err){
        logger.info(err);
      }
    });
  }
}

const get_objects = function(main){
  // logger.info(main);
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

  // logger.info(objects);
  return objects;
}

var last_objects = {}

let checker = function(cb){
  logger.info('requesting.....')
  parse(API_ENDPOINT, (result)=>{
    // result = result.replace(/(\r\n|\n|\r)/gm,"");
    var object
    try {
      result = JSON.parse(result)
      objects = get_objects(result.main)
    } catch (error) {
      logger.error('json paring failed', error)
      return false
    }


    // let object = result.main;
    // let objects = get_objects(result.main);
    logger.info('request done.')


    // if new object found send notification
    // if( typeof last_objects !== 'undefined'){
      let new_objects = [];
      for(var i in objects){
        if( typeof last_objects[i] === 'undefined'){
          new_objects.push(objects[i])
        }
      }

      if ( new_objects.length > 0){
        notification(new_objects)
      } else {
        logger.info('no new object found')
      }
    // }

    last_objects = objects

    if ( typeof cb === 'function') {
      cb(last_objects)
    }

    setTimeout(checker, CHECK_FREQ)
  })
}

checker( _objects =>{
  logger.info('objects')
  logger.info(_objects)
})


// setInterval(checker, CHECK_FREQ)

