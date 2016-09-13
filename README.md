#WiFi-Provision

This is a NodeJS app to configure WiFi on a Raspberry Pi 3 or a 
Pi Zero with IoT pHAT via Bluetooth Low Energy and Web Bluetooth.

The reasons for this can be found [here](http://www.hardill.me.uk/wordpress/2016/09/10/provisioning-wifi-iot-devices/)

To run clone the code

    git clone https://github.com/hardillb/wifi-provision.git

Edit the `namePrefix` in the `static/index.html` to match the host name for the pi then copy it to a public facing http server that supports https and generate a new short URL for this location. Take the short URL and edit the last line of `index.js`

    eddystone.advertiseUrl('http://goo.gl/uNGCsy',options);

You can now run this as root

    node index.js

It should now broadcast the short URL as a Eddystone beacon, when you follow the link you will get a page that will connect to the
device and allow you to push SSID and password to it. Once connected it will send the device IP address back to the page. 