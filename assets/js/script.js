var userFormEl = document.querySelector('#user-form');
var cityInputEl = document.querySelector('#city-name');
var savedCityContainerEl = document.querySelector('.saved-city-container');
var cityWeatherEl = document.querySelector('.city-weather');
var cityAndDateEl = document.querySelector('#city-and-date');
var fiveDayForecastEl = document.querySelector('#five-day-forecast');
var savedCityNames;
var degreesSymbol = '\u00B0';

var formSubmitHandler = function (event) {
  event.preventDefault();
  cityWeatherEl.style.display = "flex";
  var cityName = cityInputEl.value.trim();
  if (cityName) {
    getCityCoordinates(cityName);
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
    // var apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + latitude + '&lon=' + longitude + '&appid=fc2784c2f5d886b20ace6fa5f1271854' + '&units=imperial';
    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude + '&appid=fc2784c2f5d886b20ace6fa5f1271854' + '&units=imperial';

    fetch(apiUrl)
        .then(function (response) {
            console.log(response);
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data);
                displayCityWeather(data, data.name);
                getFiveDayForecast(latitude, longitude);
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
    if (forecastData === null) {
        cityWeatherEl.textContent = 'No forecast found.';
        return;
    }
    // Get current date
    var currentDate = dayjs();
    
    //get weather icon
    var iconcode = forecastData.weather[0].icon;
    var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";

    //display city, date, & weather icon
    cityWeatherEl.innerHTML = "";
    var element = `<h2 class="subtitle"><span id="city-and-date">${nameOfCity + " (" + currentDate.format('MM/DD/YYYY') + ") "}</span><img id="wicon" src="${iconurl}"></h2>`
    cityWeatherEl.innerHTML += element;

    var cityTempEl = document.createElement('span');
    var cityWindEl = document.createElement('span');
    var cityHumidityEl = document.createElement('span');
    cityTempEl.textContent = "Temp: " + forecastData.main.temp + " " + degreesSymbol + "F";
    cityWindEl.textContent = "Wind: " + forecastData.wind.speed + " MPH";
    cityHumidityEl.textContent = "Humidity: " + forecastData.main.humidity + " %";
    cityWeatherEl.appendChild(cityTempEl);
    cityWeatherEl.appendChild(cityWindEl);
    cityWeatherEl.appendChild(cityHumidityEl);
};

var getFiveDayForecast = function (latitude, longitude) {
    var apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + latitude + '&lon=' + longitude + '&appid=fc2784c2f5d886b20ace6fa5f1271854' + '&units=imperial';

    fetch(apiUrl)
        .then(function (response) {
            console.log(response);
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data);
                display5DayForecast(data.list);
                addCityToSearchHistory(data.city.name);
            });
        } else {
            alert('Error: ' + response.statusText);
        }
        })
        .catch(function (error) {
        alert('Unable to get 5-day forecast');
        });
};

var display5DayForecast = function (forecastData) {
    if (forecastData.length === 0) {
        fiveDayForecastEl.textContent = 'No 5-day forecast found.';
      return;
    }
    fiveDayForecastEl.innerHTML = "";

    // Display 5 day forecast
    for (var i = 0; i < 40; i += 8) {

        //build card for 1 day
        var tempCardEl = document.createElement('div');
        tempCardEl.setAttribute('class', 'flex-column list-item');

            //format and display forecast date
            var tempDate = document.createElement('span');
            tempDate.textContent = dayjs(forecastData[i].dt_txt).format('MM/DD/YYYY');
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
            tempCityTempEl.textContent = "Temp: " + forecastData[i].main.temp + " " + degreesSymbol + "F";
            tempCityWindEl.textContent = "Wind: " + forecastData[i].wind.speed + " MPH";
            tempCityHumidityEl.textContent = "Humidity: " + forecastData[i].main.humidity + " %";
            tempCardEl.appendChild(tempCityTempEl);
            tempCardEl.appendChild(tempCityWindEl);
            tempCardEl.appendChild(tempCityHumidityEl);

            fiveDayForecastEl.appendChild(tempCardEl);
    }
};

var addCityToSearchHistory = function(cityToSave) {
    //get saved cities from local storage
    getSavedCities();
    if (savedCityNames.includes(cityToSave)) {
        return;
    } else {
        //city is not already saved:
            var cityButton = document.createElement('button');
            cityButton.setAttribute('class', "btn saved-city");
            cityButton.textContent = cityToSave;
            cityButton.addEventListener('click', function() {
                getCityCoordinates(cityButton.textContent);
                });
            savedCityContainerEl.appendChild(cityButton);
            //add city to local storage
            if (savedCityNames === null) {
                savedCityNames = cityToSave;
            } else {
                savedCityNames.push(cityToSave);
                }
            setSavedCities();
    }
};

function setSavedCities() {
    window.localStorage.setItem("savedCities", JSON.stringify(savedCityNames));
}

function getSavedCities() {
    savedCityNames = JSON.parse(window.localStorage.getItem("savedCities"));
    if (savedCityNames === null) {
        savedCityNames = []
    }
}

function init() {
    //clear saved cities in local storage
        savedCityNames = [];
        //set in local storage to empty array
        setSavedCities();
    cityWeatherEl.style.display = "none";
    cityInputEl.placeholder = 'Please enter a city name';
}
  
init();

userFormEl.addEventListener('submit', formSubmitHandler);

