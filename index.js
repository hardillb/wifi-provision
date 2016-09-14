var os = require('os');
var bleno = require('bleno');
var eddystone = require('eddystone-beacon');

var exec = require('child_process').exec;
var path = require('path');

var SSIDCharacteristic = require('./lib/SSIDCharacteristic');
var PasswordCharacteristic = require('./lib/PasswordCharacteristic');
var IpAddressCharacteristic = require('./lib/IPAddressCharacteristic');

var ssidChar = new SSIDCharacteristic(newSSID);
var passwordChar = new PasswordCharacteristic(newPassword);
var ipAddressChar = new IpAddressCharacteristic();

var ssid;
var password;
var ipaddress;
var interval;

function newSSID(newSSID) {
  console.log(newSSID.toString('utf8'));
  ssid = newSSID.toString('utf8');
}

function newPassword(newPass) {
  console.log(newPass.toString('utf8'));
  password = newPass.toString('utf8');

  var script = path.join(__dirname, 'setNetwork.sh');

  // exec(script,[ssid, password], function(err, stdout, stderr) {
  //   if (err) {
  //     console.log(err);
  //   }

  //   if (stderr) {
  //     console.log(stderr);
  //   }    

  //   if (stdout) {
  //     console.log(stdout);
  //   }
  // });

  //check for ipAddress every 5 seconds
  if(interval) {
    clearInterval(interval);
  }
  interval = setInterval(checkIPAddress,5000);
}

function checkIPAddress() {
  var interfaces = os.networkInterfaces();
  if (interfaces['wlan0']) {
  //if (interfaces['usb0']) {
    var wlan0 = interfaces['wlan0'];
    //var wlan0 = interfaces['usb0'];
    for (var i=0; i< wlan0.length; i++) {
      if (wlan0[i].family === 'IPv4') {
        console.log(wlan0[i].address);
        ipAddressChar.update(wlan0[i].address);
        clearInterval(interval);
      }
    }
  }
} 

var service = new bleno.PrimaryService({
	uuid: 'f9ea9184-8645-4cdc-a379-164a922fa410',
	characteristics: [
		ssidChar,
		passwordChar,
		ipAddressChar
	]
});

bleno.once('advertisingStart', function(err) {
  if (err) {
    throw err;
  }

  console.log('on -> advertisingStart');
  bleno.setServices([
    service
  ]);
});

var hostname = os.hostname();
  
var options = {
  name: hostname
};

eddystone.advertiseUrl('http://goo.gl/uNGCsy',options);