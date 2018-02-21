// Weather Recording App

const express = require('express');
const app = express();

const axios = require('axios');
const API_KEY = "e368dea5cdf25f5341ee10bb39424eeb";

var city = "Littoinen";
var lang = "fi";
var url = "http://api.openweathermap.org/data/2.5/weather?q="+city+"&units=metric&lang="+lang+"&APPID="+API_KEY;

var timeInterval = 1000 * 60 * 60 * 3; // Every 3th hour
//var timeInterval = 1000 * 10; // For testin every 10th second

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

app.get('/',(req,res) => {
    var weatherData = [];
    var cursor = Weather.find({ }).cursor();
    cursor.on('data', function(doc) {
    // Called once for every document
        weatherData.push(doc);
    });
    cursor.on('close', function() {
    // Called when done
        
        res.send(weatherData);
    });
});

app.listen(8080, () => console.log("Running on 8080"));

const Weather = mongoose.model('Weather', { 
    time:Date,
    class:String,          
    description:String,
    temperature:Number,
    humidity:Number,
    pressure:Number,
    wind_speed:Number,
    wind_direction:Number

 });

function getWeatherData() {
    axios.get(url)
      .then(function (response) {
        let newDate = new Date();
        const littoinen = new Weather({ 
            time:newDate,
            class:response.data.weather[0].main,          
            description:response.data.weather[0].description,
            temperature:response.data.main.temp,
            humidity:response.data.main.humidity,
            pressure:response.data.main.pressure,
            wind_speed:response.data.wind.speed,
            wind_direction:response.data.wind.deg
        });
        
        littoinen.save().then(() =>{ console.log('Saving accomplished.');});


      })
      .catch(function (error) {
        console.log(error);
        });   
      
  }

setInterval(getWeatherData,timeInterval)

