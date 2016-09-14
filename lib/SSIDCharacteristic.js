var bleno = require('bleno');
var util = require('util');
var exec = require('child_process').exec;
var os = require('os');
var path = require('path');

function SSIDCharacteristic(callback) {
  bleno.Characteristic.call(this, {
    uuid: 'f9ea9184-8645-4cdc-a379-164a922fa411',
    properties: ['write','read','notify'],
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

SSIDCharacteristic.prototype.onReadRequest = function(offset, callback) {
  var buf = new Buffer('foo', 'utf8');
  callback(this.RESULT_SUCCESS, buf);
}

SSIDCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  this._updateValueCallback = updateValueCallback;
  console.log("start notify ssid");
  getSSIDs(updateValueCallback);
}

SSIDCharacteristic.prototype.onUnsubscribe = function () {
  this._updateValueCallback = null;
}

SSIDCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  this._callback(data);
  callback(this.RESULT_SUCCESS);
}

function getSSIDs(callback) {
  var script = path.join(__dirname, '..', 'scanWiFi.sh');
  exec(script, [], function(err, stdout, stderr) {

    if (err) {
      console.log(err);
    }

    if (stderr) {
      console.log("stderr: ", stderr);
    }

    var lines = stdout.split(os.EOL);
    console.log("lines: ", lines.length);
    for (var i=0; i<lines.length; i++) {
      if (callback) {
        console.log(lines[i]);
        var buffer = new Buffer(lines[i], 'utf8');
        callback(buffer);
      }
    }
  });
}

module.exports = SSIDCharacteristic;