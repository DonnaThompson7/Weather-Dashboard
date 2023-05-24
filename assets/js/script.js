var userFormEl = document.querySelector('#user-form');
var cityInputEl = document.querySelector('#city-name');
var savedCityContainerEl = document.querySelector('#saved-city-container');
var cityWeatherEl = document.querySelector('.city-weather');
var cityAndDateEl = document.querySelector('#city-and-date');
var weatherIconEl = document.querySelector('#wicon');
var fiveDayForecastEl = document.querySelector('#five-day-forecast');


var formSubmitHandler = function (event) {
  event.preventDefault();

  var cityName = cityInputEl.value.trim();
  if (cityName) {
    getCityCoordinates(cityName);
    
    //this needs to be changed? to not textContent
    // savedCityContainerEl.textContent = '';
    cityInputEl.value = '';
  } else {
    cityInputEl.placeholder = 'Please enter a city name';
  }
};


var getCityCoordinates = function (city) {
    var apiUrl = 'https://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=5&appid=fc2784c2f5d886b20ace6fa5f1271854';
  fetch(apiUrl)
    .then(function (response) {
        console.log(response);
      if (response.ok) {
        response.json().then(function (data) {
            console.log(data);
            console.log(data[0].lat);
            getCityWeather(data[0].lat,data[0].lon);
        });
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('Unable to get city coordinates');
    });
};

var getCityWeather = function (latitude, longitude) {
    var apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + latitude + '&lon=' + longitude + '&appid=fc2784c2f5d886b20ace6fa5f1271854' + '&units=imperial';

  fetch(apiUrl)
    .then(function (response) {
        console.log(response);
      if (response.ok) {
        response.json().then(function (data) {
            console.log(data);
            console.log(data.city.name);
            displayCityWeather(data.list, data.city.name);
            display5DayForecast(data.list);
        });
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('Unable to get 5-day forecast');
    });
};

var displayCityWeather = function (forecastData, nameOfCity) {
    if (forecastData.length === 0) {
        cityWeatherEl.textContent = 'No forecast found.';
        return;
    }
    // Display the city and current date
    var currentDate = dayjs();
    //get weather icon
    var iconcode = forecastData[0].weather[0].icon;
    var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
    cityAndDateEl.textContent = (nameOfCity + " (" + currentDate.format('MM/DD/YYYY') + ") ");
    weatherIconEl.setAttribute('src', iconurl);

    var cityTempEl = document.createElement('span');
    var cityWindEl = document.createElement('span');
    var cityHumidityEl = document.createElement('span');
    //??what is symbol for degrees
    cityTempEl.textContent = "Temp: " + forecastData[0].main.temp + " F";
    cityWindEl.textContent = "Wind: " + forecastData[0].wind.speed + " MPH";
    cityHumidityEl.textContent = "Humidity: " + forecastData[0].main.humidity + " %";
    cityWeatherEl.appendChild(cityTempEl);
    cityWeatherEl.appendChild(cityWindEl);
    cityWeatherEl.appendChild(cityHumidityEl);
};

var display5DayForecast = function (forecastData) {
    if (forecastData.length === 0) {
        fiveDayForecastEl.textContent = 'No 5-day forecast found.';
      return;
    }
    // Display 5 day forecast
    for (var i = 1; i < 6; i++) {

        //build card for 1 day
        var tempCardEl = document.createElement('div');
        tempCardEl.setAttribute('class', 'flex-column');

            //??convert date or add 1 to current date from dayjs
            var tempDate = document.createElement('span');
            tempDate.textContent = 'XX/XX/XXXX';
            tempCardEl.appendChild(tempDate);

            //get weather icon
            var iconcode = forecastData[i].weather[0].icon;
            var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
            var tempWeatherIconEl = document.createElement('img');
            tempWeatherIconEl.setAttribute('src', iconurl);
            tempCardEl.appendChild(tempWeatherIconEl);

            var tempCityTempEl = document.createElement('span');
            var tempCityWindEl = document.createElement('span');
            var tempCityHumidityEl = document.createElement('span');
            //??what is symbol for degrees
            //??how to put these in a column
            tempCityTempEl.textContent = "Temp: " + forecastData[i].main.temp + " F";
            tempCityWindEl.textContent = "Wind: " + forecastData[i].wind.speed + " MPH";
            tempCityHumidityEl.textContent = "Humidity: " + forecastData[i].main.humidity + " %";
            tempCardEl.appendChild(tempCityTempEl);
            tempCardEl.appendChild(tempCityWindEl);
            tempCardEl.appendChild(tempCityHumidityEl);

            fiveDayForecastEl.appendChild(tempCardEl);

    }
};

userFormEl.addEventListener('submit', formSubmitHandler);
