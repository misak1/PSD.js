var util = require('util');
var PSD = require('psd');
var json = require('json');

var file = process.argv[2] || './href_test.psd';

var psd = PSD.fromFile(file);
psd.parse();

eval("var obj = " + util.inspect(psd.tree().export(), {depth: null}) + ";");
var json = JSON.stringify(obj);
// console.log(json);

var JSONPath = require('JSONPath');
eval("var json2 = " + json + ";");
console.log(JSONPath({json: json2, path: "$.children[*].*"}));
console.log(JSONPath({json: json2, path: "$.children[*].children[*].*"}));
