const express = require('express');
const app = express();
const Gpio = require('pigpio').Gpio;

app.post('/on/:pin', (req, res) => {
  const pin = new Gpio(req.params.pin, { mode: Gpio.OUTPUT });
  pin.digitalWrite(1);
  console.log(`Turned Pin #${req.params.pin} On!`);
});

app.post('/off/:pin', (req, res) => {
  const pin = new Gpio(req.params.pin, { mode: Gpio.OUTPUT });
  pin.digitalWrite(0);
  console.log(`Turned Pin #${req.params.pin} Off!`);
});

app.listen(3000);
console.log('PiCar Server Running on Port 3000!');
