const myApiKey = "2ca732745c4860a1e30f12f65cec56c5";
var lat = String;
var lon = String;
var userFormEl = document.querySelector("#user-form");
var cityInputEl = document.querySelector("#city");
var searchTermEl = document.querySelector("#city-search-term");
var apiTempEl = document.querySelector("#apiTemp");
var apiHumidityEl = document.querySelector("#apiHumidity");
var apiWindEl = document.querySelector("#apiWind");
var apiUVEl = document.querySelector("#apiUV");
var recentSearchContainerEl = document.querySelector("#recent-search-container");
var dateEl = document.querySelector("#date");


var formSubmitHandler = function(event) {
    // prevent page from refreshing
    event.preventDefault();

    // get value from input element
    var cityInput = cityInputEl.value.trim();
    console.log(cityInput);

    // if truthy, run getWeather and clear input field, otherwise alert user
    if (cityInput) {
        getWeather(cityInput);
        addCitySearchHistory(cityInput);
        getWeatherForecast(cityInput);
        
        // clear old content
        searchTermEl.textContent = "";
        cityInputEl.textContent = "";

    } else {
        alert("Please enter a city");
    }
};


var getWeather = function(city) {
    //format the OpenWeather api url
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" 
    + city.replace(" ","%20") 
    + "&APPID="
    + myApiKey
    + "&units=metric"; 
    console.log(apiUrl);

    // make a request to the url
    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                console.log(response);
                response.json().then(function(data) {
                    console.log(data);
                    displayWeatherToday(data, city);
                });
            } else {
                alert(`Error: ${response.statusText}`);
            }
        })
        .catch(function(error) {
            // Notice this `.catch()` getting chained onto the end of the `.then()` method
            alert("Unable to connect to OpenWeather");
        });
};

var displayWeatherToday = function (city, searchTerm) {
    // check if api returned any cities
    if (city.length===0) {
        searchTermEl.textContent = "City not found.";
        return;
    }
    // populate today
    searchTermEl.textContent=(city.name + city.country);
    dateEl.textContent=(moment().format("DD MMM YYYY"));
    apiTempEl.textContent=("Temperature: " + city.main.temp + "°C");
    apiHumidityEl.textContent=("Humidity: " + city.main.humidity);
    apiWindEl.textContent=("Wind Speed: " + city.wind.speed + "KPH");
    // UV levels don't seem to be available in openWeather api
    // apiUVEl.textContent=("UV: " + city.weather.main);
};

var getWeatherForecast = function(city) {
    // using Geocoding api to convert city into longitude/latitude 
    //format the Geocoding api url
    var geoApiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" 
        + city.replace(" ","%20") 
        + "&limit=5&appid="
        + myApiKey
        + "&units=metric"; 
    console.log(geoApiUrl);

    // make a request to the url
    fetch(geoApiUrl)
        .then(function(response) {
            if (response.ok) {
                console.log(response);
                response.json().then(function(data) {
                    console.log(data);
                    lat = data[0].lat;
                    lon = data[0].lon;
                    var name = data[0].name;
                    var country = data[0].country;
                    console.log(lat+name+country+lon);
                });
            } else {
                alert(`Error: ${response.statusText}`);
            }
        })
        .catch(function(error) {
            // Notice this `.catch()` getting chained onto the end of the `.then()` method
            alert("Unable to connect to OpenWeather");
        });
};

var passToApi = function(lat,lon) {
    var apiUrl = "http://api.openweathermap.org/data/2.5/forecast?lat=" 
        + lat 
        + "&lon="
        + lon
        + "&appid="
        + myApiKey
        + "&units=metric"; 
    console.log(apiUrl);

    // make a request to the url
    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                console.log(response);
                response.json().then(function(data) {
                    console.log(data);
                    // displayWeatherForecast(data, city);
                });
            } else {
                alert(`Error: ${response.statusText}`);
            }
        })
        .catch(function(error) {
            // Notice this `.catch()` getting chained onto the end of the `.then()` method
            alert("Unable to connect to OpenWeather Forecasts");
        });
};

// var displayWeatherForecast = function(lat,lon) {
//     // check if api returned any cities
//     if (city.length===0) {
//         searchTermEl.textContent = "City not found.";
//         return;
//     }
//     // populate today
//     searchTermEl.textContent=(city.name + city.country);
//     dateEl.textContent=(moment().format("DD MMM YYYY"));
//     apiTempEl.textContent=("Temperature: " + city.main.temp + "°C");
//     apiHumidityEl.textContent=("Humidity: " + city.main.humidity);
//     apiWindEl.textContent=("Wind Speed: " + city.wind.speed + "KPH");

// };



var addCitySearchHistory = function(city) {
    // create a container for each city
    var cityEl = document.createElement("a");
    cityEl.classList = "btn btn-light list-item flex-row justify-space-between align-center";
    // currently set to a link, need to finalise 
    cityEl.setAttribute("href", "https://api.openweathermap.org/data/2.5/weather?q=" 
        + city.replace(" ","%20") 
        + "&APPID="
        + myApiKey);
    cityEl.textContent = city;
    console.log(cityEl);

    // append to container
    recentSearchContainerEl.appendChild(cityEl);
};


userFormEl.addEventListener("submit", formSubmitHandler);

// clicking on search history
// recentSearchContainerEl.addEventListener("submit", formSubmitHandler);

