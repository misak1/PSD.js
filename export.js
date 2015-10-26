var PSD = require('psd');

var file = process.argv[2] || './href_test.psd';
var start = new Date();

PSD.open(file).then(function (psd) {
  return psd.image.saveAsPng('./output.png');
}).then(function () {
  console.log("Finished in " + ((new Date()) - start) + "ms");
});;
