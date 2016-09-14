var bleno = require('bleno');
var util = require('util');

function IPAddressCharacteristic() {
  bleno.Characteristic.call(this, {
    uuid: 'f9ea9184-8645-4cdc-a379-164a922fa413',
    properties: ['read','notify'],
    descriptors: [
      new bleno.Descriptor({
        uuid: '2901',
        value: 'IP Address'
      })
    ]
  });
  this._value = "foo";
}

util.inherits(IPAddressCharacteristic, bleno.Characteristic);

IPAddressCharacteristic.prototype.onReadRequest = function(offset, callback) {
  var buf = new Buffer(this._value, 'utf8');
  callback(this.RESULT_SUCCESS, buf);
}

IPAddressCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  this._updateValueCallback = updateValueCallback;
  console.log("start notify ipAddress");
}

IPAddressCharacteristic.prototype.onUnsubscribe = function () {
  this._updateValueCallback = null;
}

IPAddressCharacteristic.prototype.update = function(ipAddress) {
  var buffer = new Buffer(ipAddress, 'utf8');
  this._value = ipAddress;
  if (this._updateValueCallback) {
    this._updateValueCallback(buffer);
  }
}

module.exports = IPAddressCharacteristic;