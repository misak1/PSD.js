var M = require('m-require');
M.require('m-util');
var log = M.require('m-log');

var util = M.require('util');
var PSD = M.require('psd');
var json = M.require('json');
var _ = M.require('underscore');
var fs = M.require('fs');
var it79 = M.require('iterate79');

// var file = process.argv[2] || './href_test.psd';
// var psd = PSD.fromFile(file);
var file = './href_test.psd';
var fs   = M.require('fs'),
    // file = process.argv[2],
    data = fs.readFileSync(file);

var base64PSD = data.toString('base64');
log.input(base64PSD);

var psd = new PSD(new Buffer(base64PSD, 'base64'));
psd.parse();

eval("var obj = " + util.inspect(psd.tree().export(), {
    depth: null
}) + ";");
var json = JSON.stringify(obj);
log.help(json);
var JSONPath = M.require('JSONPath');
String.prototype.addslashes = function (s){
  var reg = new RegExp(s, 'g');
  return this.replace(reg, "\\"+ s);
}
String.prototype.repeat = function (i){
  var repeatStr = this;
  var str = "";
  while(i>0){
    str += repeatStr;
    i--;
  }
  return str;
}

var i = 1;
var psdData = [];
while(true){
  // var JSONPath = M.require('JSONPath');
  eval("var json2 = " + json + ";");
  var path = "$" + ".children[*]".repeat(i);
  // log.help('JSONPath', path);
  var obj = JSONPath({
      json: json2,
      path: path
  });
  // log.help('JSONPath', path);
  if(obj.length == 0){
    break;
  }

  for (var x in obj) {
    var c = obj[x];
    if (c.top !== undefined) {
      var tmp = "[{" +
          '"name":"' + (c.name).addslashes('"') + '",' +
          '"visible":' + c.visible + "," +
          '"top":' + c.top + "," +
          '"left":' + c.left + "," +
          '"width":' + c.width + "," +
          '"height":' + c.height +
       "}]";
       eval("var layerData = " + tmp + ";");
       psdData.push(layerData);
    }
  }
  i++;
}
var PSDjson = JSON.stringify(psdData);

var link_html = '';
var ary = JSON.parse(PSDjson);
var regexp = /^<(.*)>$/gi;
var regexp2 = /href=\"(.*)\"/gi;
for(var r in ary) {
  var data = ary[r][0];
  // log.help(data.name,data.visible,data.top,data.left,data.width,data.height);
  var name  = data.name;
  var matches = name.match(regexp);
  // log.help(name, matches);
  if(matches !== null && matches.length > 0){
    // <a href="foo">からhrefの値を取得
    var matches2 = data.name.match(regexp2);
    // log.help('matches2', matches2);
    link_html += '<a ' + matches2 +' class="img_link" style="display:block; position:absolute; top:' + data.top + 'px; left:' + data.left + 'px; width:' + data.width + 'px; height:' + data.height + 'px;"></a>' + "\n";
  }
}
// log.help(link_html);
var _pdf = (function() {/*
<style>
.psdrb_html_generator .img_link{opacity:0; background:rgba(204,204,204,0.7);}
</style>
<div class="psdrb_html_generator" style="position:relative;margin:0;padding:0;">
<img src="<%- imgFile %>" alt="">
<%= link_html %>
</div>
*/}).toString().uHereDoc();
var pdfTmpl = _.template(_pdf);
var fileName =  'href_test.html';

// PNG作成
png = psd.image.toPng(); // get PNG object
var imgFile = './href_test.png';
psd.image.saveAsPng(imgFile).then(function () {
  log.out('Exported!');
});

// ファイル書き出し
var html = pdfTmpl({'link_html': _.unescape(link_html), 'imgFile': imgFile});
fs.writeFile(fileName, html, 'utf8', function(){
  log.out("output! " + fileName);
});
