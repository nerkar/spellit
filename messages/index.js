"use strict";
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");
var dictionary = require('dictionary-en-us');
var nspell = require('nspell'); 
var wordnet = require('wordnet');
var outputStr = "";

var useEmulator = (process.env.NODE_ENV == 'development');

var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword'],
    stateEndpoint: process.env['BotStateEndpoint'],
    openIdMetadata: process.env['BotOpenIdMetadata']
});

var bot = new builder.UniversalBot(connector);

bot.dialog('/', function (session) {
  checkSpell(session.message.text, function (outputStr) {
    session.send(' : ' + outputStr);
  })
    //session.send('You said ' + session.message.text);
});

if (useEmulator) {
    var restify = require('restify');
    var server = restify.createServer();
    server.listen(3978, function() {
        console.log('test bot endpont at http://localhost:3978/api/messages');
    });
    server.post('/api/messages', connector.listen());    
} else {
    module.exports = { default: connector.listen() }
}


function checkSpell(word, callback) {
  var result = "";
  dictionary(function (err, dict) {
    if (err) {
      callback('Oops! something went wrong...')
    }
    var spell = nspell(dict);
    if (spell.correct(word) === true) {

      //result = 'Hey here is the meaning of word with few sentence usage' + lookupWord(word);
      lookupWord(word, function (meaning) {
        callback(' : ' + meaning)
      })
    }
    else {
      callback('I think there is some thing wrong in spelling -- here are few Suggestions : \n' + spell.suggest(word));
    }

  });
}

function lookupWord(word, callback) {
  var glossary = "";
  wordnet.lookup(word, function (err, definitions) {
    if (err) {
      callback('no definition found for spesified word')
    }
    else {
      if (definitions) {
        definitions.forEach(function (definition) {
          //console.log('  words: %s ', JSON.stringify(definition ));                      
          //console.log('  %s', definition.glossary);
          //glossary = definition.glossary;
          callback(definition.glossary);
        });
      }
    }

  });
}