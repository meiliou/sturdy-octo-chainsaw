// API variables
const myApiKey = "2ca732745c4860a1e30f12f65cec56c5";
var lat = "";
var lon = "";
// input variables
var userFormEl = document.querySelector("#user-form");
var cityInputEl = document.querySelector("#city");
var searchTermEl = document.querySelector("#city-search-term");
var recentSearchContainerEl = document.querySelector("#recent-search-container");
// weather today variables
var apiTempEl = document.querySelector("#apiTemp");
var apiHumidityEl = document.querySelector("#apiHumidity");
var apiWindEl = document.querySelector("#apiWind");
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
        cityInputEl.value = "";  // set value to empty string
        console.log(cityInputEl);

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
                    displayWeatherToday(data);
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

var displayWeatherToday = function (city) {
    // check if api returned any cities
    if (city.length===0) {
        searchTermEl.textContent = "City not found.";
        return;
    }
    // populate today
    console.log(city);
    searchTermEl.textContent=(city.name +", " + city.sys.country);
    dateEl.textContent=(moment().format("DD/MM/YY"));
    apiTempEl.textContent=("Temperature: " + Math.round(city.main.temp*10)/10 + "°C");
    apiHumidityEl.textContent=("Humidity: " + city.main.humidity);
    apiWindEl.textContent=("Wind Speed: " + city.wind.speed + "KPH");
    var iconCode = city.weather[0].icon;
    var iconUrl = "https://openweathermap.org/img/w/" + iconCode + ".png"
    $('#icon').attr('src',iconUrl);
    // UV levels don't seem to be available for FREE subscription under openWeather api
    // apiUVEl.textContent=("UV: " + weather.weather.main);
};

var getWeatherForecast = function(city) {
    // using Geocoding api to convert city into longitude/latitude 
    //format the Geocoding api url
    var geoApiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" 
        + city.replace(" ","%20") 
        + "&limit=5&appid=" + myApiKey
        + "&units=metric"; 
    console.log(geoApiUrl);

    // make a request to the url
    fetch(geoApiUrl)
        .then(function(response) {
            if (response.ok) {
                console.log(response);
                response.json().then(function(data) {
                    lat = data[0].lat;
                    lon = data[0].lon;
                    var name = data[0].name;
                    var country = data[0].country;
                    console.log(lat+name+country+lon);

                    // format the forecast api url
                    var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" 
                        + lat 
                        + "&lon=" + lon
                        + "&appid=" + myApiKey
                        + "&units=metric"; 
                    console.log(apiUrl);

                    fetch(apiUrl)
                        .then(function(response) {
                            if (response.ok) {
                                console.log(response);
                                response.json().then(function(data) {
                                    console.log(data);
                                    displayWeatherForecast(data);
                                });
                            } else {
                                alert(`Error: ${response.statusText}`);
                            }
                        })
                        .catch(function(error) {
                            // Notice this `.catch()` getting chained onto the end of the `.then()` method
                            alert("Unable to connect to OpenWeather");
                        });
                });
            }
        })
        .catch(function(error) {
            // Notice this `.catch()` getting chained onto the end of the `.then()` method
            alert("Unable to connect to OpenWeather");
        })
};

var displayWeatherForecast = function(city) {
    // clear old forecast cards
    $("#cardRows").empty();
    
    
    // check if api returned any cities
    if (city.length===0) {
        searchTermEl.textContent = "City not found.";
        return;
    }

    // Find the first list item that starts at 12:00 noon
    var firstNoonIndex = 0;
        for (var i = 0; i < city.list.length; i++) {
            if (city.list[i].dt_txt.includes('12:00:00')) {
             firstNoonIndex = i;
        break;
        }
    }

    // Populate forecast starting from firstNoonIndex
    console.log(city);
    for (var i = firstNoonIndex; i < city.list.length; i += 8) {
        var iconCode = city.list[i].weather[0].icon;
        var iconUrl = "https://openweathermap.org/img/w/" + iconCode + ".png";
        var temp = Math.round(city.list[i].main.temp*10)/10 + "°C";
        var humidity = city.list[i].main.humidity;
        var $cardRows = $('#cardRows');

        // Create a new div with class and card structure
        var $card = $('<div class="col-sm-3 col-lg-3 mb-2">' +
                        '<div class="card">' +
                            '<h5 class="card-header">' + city.list[i].dt_txt.split(" ")[0] + '</h5>' +
                            '<div class="card-body">' +
                                '<img id="iconDay' + i + '" src="' + iconUrl + '" alt="">' +
                                '<p id="tempDay' + i + '">Temperature: ' + temp + '</p>' +
                                '<p id="humidityDay' + i + '">Humidity: ' + humidity + '</p>' +
                            '</div>' +
                        '</div>' +
                    '</div>');
        $cardRows.append($card);
    }
};

var addCitySearchHistory = function(city) {
    // create a container for each city
    var cityEl = document.createElement("a");
    cityEl.classList = "btn btn-light list-item flex-row justify-space-between align-center";
    cityEl.textContent = city;
    console.log(cityEl);

    // add event listener to cityEl
    cityEl.addEventListener("click", function(event) {
        event.preventDefault();
        var city = $(this).text();
        cityInputEl.value = city; // set the value of cityInputEl
        
        formSubmitHandler({
            preventDefault: function() {},
            target: { city: city }
        });
    });    

    // get existing search history from local storage
    var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

    // check if the city is already in search history
    var index = searchHistory.indexOf(city);
    if (index !== -1) {
        // remove the city from its current position
        searchHistory.splice(index, 1);
    }

    // add the city to the end of search history
    searchHistory.push(city);

    // store the updated search history in local storage
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

    // append to container
    recentSearchContainerEl.appendChild(cityEl);

    // limit search history to 5 searches
    var searchHistoryItems = recentSearchContainerEl.querySelectorAll("a");
    if (searchHistoryItems.length > 5) {
        recentSearchContainerEl.removeChild(searchHistoryItems[0]);
    }    
    
};

// get search history from local storage
var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

// create an `a` element for each search history item
searchHistory.forEach(function(city) {
    var cityEl = document.createElement("a");
    cityEl.classList = "btn btn-light list-item flex-row justify-space-between align-center";
    cityEl.textContent = city;
    cityEl.addEventListener("click", function(event) {
        event.preventDefault();
        var city = $(this).text();
        cityInputEl.value = city;
        formSubmitHandler({
            preventDefault: function() {},
        target: {city: city }
    });
  });
  recentSearchContainerEl.appendChild(cityEl);
});

// limit search history to 5 searches
var searchHistoryItems = recentSearchContainerEl.querySelectorAll("a");
    if (searchHistoryItems.length > 5) {
    recentSearchContainerEl.removeChild(searchHistoryItems[0]);
}







userFormEl.addEventListener("submit", formSubmitHandler);

// clicking on search history
// recentSearchContainerEl.addEventListener("submit", formSubmitHandler);

