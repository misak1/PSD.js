var util = require('util');
var PSD = require('psd');
var json = require('json');

var file = process.argv[2] || './href_test.psd';

var psd = PSD.fromFile(file);
psd.parse();

eval("var obj = " + util.inspect(psd.tree().export(), {
    depth: null
}) + ";");
var json = JSON.stringify(obj);
// console.log(json);

var JSONPath = require('JSONPath');
// eval("var json2 = " + json + ";");
// var obj = JSONPath({
//     json: json2,
//     path: "$.children[*]"
// });
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


// var n = 1;
// (function next(n){
//   console.log('loop!' + n);
//   setTimeout(function(n){
//     if(n >= 5){
//       return;
//     }
//     n++;
//     next(n);
//   }, 1000, n);
// })(n);

// 配列処理
// var n = 0;
// var ary = ["angel", "clown", "mandarin", "surgeon"];
// (function next(n, ary){
//   console.log('loop!' + n);
//
//   setTimeout(function(n, ary){
//
//     // 処理を記述
//     console.log("key", n);
//     console.log("value",ary.shift());
//
//     if(ary.length == 0){
//       return;
//     }
//     n++;
//     next(n, ary);
//   }, 1000, n, ary);
// })(n, ary);

// 直列処理
// var it79 = require('iterate79');
// it79.fnc(
//     {} , // <- initial value of `arg`.
//     [
//         function(it, arg){
//             console.log(arg.test); // <- undefined
//             arg.test = 1;
//             setTimeout(function(){
//                 it.next(arg);
//             },1000);
//         },
//         function(it, arg){
//             console.log(arg.test); // <- 1
//             arg.test = 2;
//             setTimeout(function(){
//                 it.next(arg);
//             },10);
//         },
//         function(it, arg){
//             console.log(arg.test); // <- 2
//             it.next();
//         },
//         function(){
//             console.log('done!');
//         }
//     ]
// );


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
console.log(JSON.parse(PSDjson));


// png = psd.image.toPng(); // get PNG object
// psd.image.saveAsPng('./href_test.png').then(function () {
//   console.log('Exported!');
// });
