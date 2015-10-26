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
eval("var json2 = " + json + ";");
var obj = JSONPath({
    json: json2,
    path: "$.children[*]"
});
for (i in obj) {
    var c = obj[i];
    if (c.top !== undefined) {
        console.log('"name":' + c.name + ',' +
            '"visible":' + c.visible + "," +
            '"top":' + c.top + "," +
            '"left":' + c.left + "," +
            '"width":' + c.width + "," +
            '"height":' + c.height);
    }
}


var obj2 = JSONPath({
    json: json2,
    path: "$.children[*].children[*]"
});
for (i in obj2) {
    var c = obj2[i];
    if (c.top !== undefined) {
        console.log('"name":' + c.name + ',' +
            '"visible":' + c.visible + "," +
            '"top":' + c.top + "," +
            '"left":' + c.left + "," +
            '"width":' + c.width + "," +
            '"height":' + c.height);
    }
}

var obj3 = JSONPath({
    json: json2,
    path: "$.children[*].children[*].children[*]"
});
for (i in obj3) {
    var c = obj3[i];
    if (c.top !== undefined) {
        console.log('"name":' + c.name + ',' +
            '"visible":' + c.visible + "," +
            '"top":' + c.top + "," +
            '"left":' + c.left + "," +
            '"width":' + c.width + "," +
            '"height":' + c.height);
    }
}

var obj4 = JSONPath({
    json: json2,
    path: "$.children[*].children[*].children[*].children[*]"
});
for (i in obj4) {
    var c = obj4[i];
    if (c.top !== undefined) {
        console.log('"name":' + c.name + ',' +
            '"visible":' + c.visible + "," +
            '"top":' + c.top + "," +
            '"left":' + c.left + "," +
            '"width":' + c.width + "," +
            '"height":' + c.height);
    }
}
