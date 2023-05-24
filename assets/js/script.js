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
// var apiUrl = 'https://api.github.com/users/DonnaThompson7/repos';

  fetch(apiUrl)
    .then(function (response) {
        console.log(response);
      if (response.ok) {
        response.json().then(function (data) {
            console.log(data);
            console.log(data.city.name);
            display5DayForecast(data.list, data.city.name);
        });
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('Unable to get 5-day forecast');
    });
};

var display5DayForecast = function (forecastData, nameOfCity) {
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
    //??how to put these in a column
    cityTempEl.textContent = "Temp: " + forecastData[0].main.temp + " F";
    cityWindEl.textContent = "Wind: " + forecastData[0].wind.speed + " MPH";
    cityHumidityEl.textContent = "Humidity: " + forecastData[0].main.humidity + " %";
    cityWeatherEl.appendChild(cityTempEl);
    cityWeatherEl.appendChild(cityWindEl);
    cityWeatherEl.appendChild(cityHumidityEl);

};

userFormEl.addEventListener('submit', formSubmitHandler);
