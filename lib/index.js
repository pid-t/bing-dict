var http = require('http');
var chalk = require('chalk');
var BufferHelper = require('./bufferhelper.js');
var ent = require('ent');

var phRe = /<div class="hd_prUS">[^\[]*(.*?)<\/div>/g;
var dictRe = /<span class="pos[^"]*">(.*?)<\/span><span class="def[^"]*">(.*?)<\/span>/g;
var sampleRe = /<div class="se_li">(.*?)<div class="se_li">/g;

function cleanText(text) {
  return ent.decode(text).replace(/<\/?[^>]+>/g, '');
}

function parsePhonetic(html, word) {
  var arr;
  while((arr = phRe.exec(html)) !== null) {
    console.log('  ');
    console.log(cleanText(arr[1]));
  }
}

function parseDict(html) {
  var arr;
  console.log('---------- Translate ----------');
  
  while((arr = dictRe.exec(html)) !== null ) {
    console.log(chalk.green('%s  %s'), cleanText(arr[1]), cleanText(arr[2]));
  }
}

function parseSample(html) {
  var arr;
  console.log('---------- Sample ----------');
  while((arr = sampleRe.exec(html)) !== null) {
    console.log(chalk.green(cleanText(arr[1])));
  }
}

function parse(html, word) {
  var re = /<div class="lf_area">.*<div class="sidebar">/g;
  if(html.search(re) < 0 ) {
    console.log(chalk.red('Can not translate word: ' + word));
    process.exit(0);
  }
  parsePhonetic(html);
  parseDict(html);
  parseSample(html);  
}

function doTranslate(query) {
  http.get('http://cn.bing.com/dict/search?q=' + encodeURIComponent(query), function(res){
    var bufferHelper = new BufferHelper();
    res.on('data', function(d){
      bufferHelper.concat(d);
    });
    res.on('end', function() {
      var html = bufferHelper.toBuffer().toString();
      parse(html, query);
    });
    res.on('error', function(){
      console.log(chalk.red('Failed to query'));
      process.exit(0);
    });
  });
}

module.exports = doTranslate;
