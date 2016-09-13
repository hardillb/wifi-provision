var bleno = require('bleno');
var util = require('util');

function SSIDCharacteristic(callback) {
  bleno.Characteristic.call(this, {
    uuid: 'f9ea9184-8645-4cdc-a379-164a922fa411',
    properties: ['write'],
    descriptors: [
      new bleno.Descriptor({
        uuid: '2901',
        value: 'SSID'
      })
    ]
  });
  this._callback = callback;
}

util.inherits(SSIDCharacteristic, bleno.Characteristic);

SSIDCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  this._callback(data);
  callback(this.RESULT_SUCCESS);
}

module.exports = SSIDCharacteristic;