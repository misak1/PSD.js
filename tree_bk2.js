var util = require('util');
var PSD = require('psd');
var json = require('json');
var _ = require('underscore');
var fs = require('fs');
var it79 = require('iterate79');

var file = process.argv[2] || './href_test.psd';

var psd = PSD.fromFile(file);
psd.parse();

eval("var obj = " + util.inspect(psd.tree().export(), {
    depth: null
}) + ";");
var json = JSON.stringify(obj);

var JSONPath = require('JSONPath');
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
  // var JSONPath = require('JSONPath');
  eval("var json2 = " + json + ";");
  var path = "$" + ".children[*]".repeat(i);
  // console.log('JSONPath', path);
  var obj = JSONPath({
      json: json2,
      path: path
  });
  // console.log('JSONPath', path);
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
  // console.log(data.name,data.visible,data.top,data.left,data.width,data.height);
  var name  = data.name;
  var matches = name.match(regexp);
  // console.log(name, matches);
  if(matches !== null && matches.length > 0){
    // <a href="foo">からhrefの値を取得
    var matches2 = data.name.match(regexp2);
    // console.log('matches2', matches2);
    link_html += '<a ' + matches2 +' class="img_link" style="display:block; position:absolute; top:' + data.top + 'px; left:' + data.left + 'px; width:' + data.width + 'px; height:' + data.height + 'px;"></a>' + "\n";
  }
}
// console.log(link_html);

var _pdf = (function() {/*
<style>
.psdrb_html_generator .img_link{opacity:0; background:rgba(204,204,204,0.7);}
</style>
<div class="psdrb_html_generator" style="position:relative;margin:0;padding:0;">
<img src="<%- imgFile %>" alt="">
<%= link_html %>
</div>
*/}).toString().replace(/(\n)/g, '').split('*')[1];
var pdfTmpl = _.template(_pdf);
var fileName =  'href_test.html';

// PNG作成
png = psd.image.toPng(); // get PNG object
var imgFile = './href_test.png';
psd.image.saveAsPng(imgFile).then(function () {
  console.log('Exported!');
});

// ファイル書き出し
var html = pdfTmpl({'link_html': _.unescape(link_html), 'imgFile': imgFile});
fs.writeFile(fileName, html, 'utf8', function(){
  console.log("output! " + fileName);
});
