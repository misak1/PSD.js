var PSD = require('psd');
var psd = PSD.fromFile("./href_test.psd");
psd.parse();

// console.log(psd.tree().export());
// console.log(psd.tree().childrenAtPath('A/B/C')[0].export());

var PSDinfo = psd.tree().children()[0].export();
console.log(PSDinfo);
for(i in PSDinfo){
  // console.log(PSDinfo[i]);
  // console.log(i);
}
// console.log(PSDinfo['children']);

// You can also use promises syntax for opening and parsing

// PSD.open("./href_test.psd").then(function (psd) {
//   return psd.image.saveAsPng('./output.png');
// }).then(function () {
//   console.log("Finished!");
// });
