var PSD = require('psd');

PSD.open('./href_test.psd').then(function (psd) {
  console.log(psd.resources.resource('layerComps').export());
});
