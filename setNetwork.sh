#!/bin/sh

#ifdown wlan0

SSID="$1"
PASS="$2"

cat << EOF > ./wpa_supplicant.conf
country=GB
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1

network={
  ssid="$SSID"
  psk="$PASS"
  proto=RSN
  key_mgmt=WPA-PSK
  pairwise=CCMP TKIP
  group=CCMP TKIP
}
EOF

#ifup wlan0