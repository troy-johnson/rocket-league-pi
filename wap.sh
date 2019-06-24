#!/bin/bash

# Script that simply executes steps from Raspberry PI Website
# https://www.raspberrypi.org/documentation/configuration/wireless/access-point.md
# Skips routing setup, because it doesn't need to be a router

SSID="aRaspberryPI"
PASSWORD="password"

# Install dependencies
sudo apt install dnsmasq hostapd

# Configure static router IP address
if ! egrep -q "^interface wlan0"; then
    cat >> /etc/dhcpcd.conf << EOF
interface wlan0
    static ip_address=172.16.0.1/24
    nohook wpa_supplicant
EOF
fi

# Configure DHCP server
sudo mv /etc/dnsmasq.conf /etc/dnsmasq.conf.$(date "+%Y%m%d%H%M%S").bak

cat > /etc/dnsmasq.conf << EOF
interface=wlan0
dhcp-range=172.16.0.10,172.16.0.60,255.255.255.0,24h
EOF

# Configure WAP

[ -f /etc/hostapd/hostapd.conf ] && sudo mv /etc/hostapd/hostapd.conf /etc/hostapd/hostapd.conf.$(date "+%Y%m%d%H%M%S").bak
cat > /etc/hostapd/hostapd.conf << EOF
interface=wlan0
driver=nl80211
ssid=$SSID
hw_mode=g
channel=7
wmm_enabled=0
macaddr_acl=0
auth_algs=1
ignore_broadcast_ssid=0
wpa=2
wpa_passphrase=$PASSWORD
wpa_key_mgmt=WPA-PSK
wpa_pairwise=TKIP
rsn_pairwise=CCMP
EOF

if grep -q -E '^#DAEMON_CONF' /etc/default/hostapd; then
    sed -i .bak 's%^#DAEMON_CONF.*%DAEMON_CONF="/etc/hostapd/hostapd.conf"%' /etc/default/hostapd
fi

sudo systemctl restart dhcpcd
sudo systemctl restart dnsmasq
sudo systemctl unmask hostapd
sudo systemctl enable hostapd
sudo systemctl start hostapd
