var http = require('http');
var express = require('express');
var app = express();

var gpio = require("pi-gpio");

app.get('/on/:pin', function(req, res) {
  gpioPin = req.params.pin;
	gpio.close(gpioPin);
  gpio.open(gpioPin, "output", function(err) {
    gpio.write(gpioPin, 1, function() {
      console.log('Pin '+ gpioPin +' is now HIGH.');
			res.sendStatus(200);
    });
  });
});

const led = new Gpio(17, {mode: Gpio.OUTPUT});

app.get('/on/:pin', function(req, res) {
  gpioPin = req.params.pin;
	gpio.close(gpioPin);
  gpio.open(gpioPin, "output", function(err) {
    gpio.write(gpioPin, 1, function() {
      console.log('Pin '+ gpioPin +' is now HIGH.');
			res.sendStatus(200);
    });
  });
});

app.get('/pulse/:pin', function(req, res) {
	let dutyCycle = 0;

	setInterval(() => {
	  led.pwmWrite(dutyCycle);

	  dutyCycle += 5;
	  if (dutyCycle > 255) {
	    dutyCycle = 0;
	  }
	}, 20);
	});

app.get('/blink/:pin/:time', function(req, res) {
	gpioPin = req.params.pin;
	time = req.params.time;
	gpio.close(gpioPin);
  gpio.open(gpioPin, "output", function(err) {
    gpio.write(gpioPin, 1, function() {
      console.log('Pin '+ gpioPin +' is now HIGH.');
    });
    setTimeout(function() {
      gpio.write(gpioPin, 0, function() {
        console.log('Pin '+ gpioPin +' is now LOW.');
				res.sendStatus(200);
        gpio.close(gpioPin);
      });
    }, time);
  });
});

app.listen(3000);
console.log('App Server running at port 3000');
