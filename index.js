var dictionary = require('dictionary-en-us');
var nspell = require('nspell');
var prompt = require('prompt');
var wordnet = require('wordnet');

prompt.start();

prompt.get(['word'], function (err, result) {
  checkSpell(result.word);
})

function checkSpell(word) {
  dictionary(function (err, dict) {
    if (err) {
      throw err;
    }
    var spell = nspell(dict);
    if (spell.correct(word) === true) {
      console.log('Hey here is the meaning of word (%s) with few sentence', word);
      lookupWord(word);
    }
    else {
      console.log('I think there is some thing wrong in spelling -- here are few Suggestions : \n' + spell.suggest(word));
    }
  });
}

function lookupWord(word) {
  wordnet.lookup(word, function (err, definitions) {
    if (err) {
      console.log('no definition found for spesified word');
    }
    else {
      if (definitions) {
        definitions.forEach(function (definition) {
          //          console.log('  words: %s ', JSON.stringify(definition ));                      
          console.log('  %s', definition.glossary);
        });
      }
    }
  });
}