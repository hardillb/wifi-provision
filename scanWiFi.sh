#!/bin/sh

iwlist wlan0 scan | grep ESSID | awk -F: '{ print $2 }'