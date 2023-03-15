var userFormEl = document.querySelector("#user-form");
var cityInputEl = document.querySelector("#city");
// var recentSearchContainerEl = document.querySelector("#recent-search-container");
var searchTermEl = document.querySelector("#city-search-term");

var formSubmitHandler = function(event) {
    // prevent page from refreshing
    event.preventDefault();

    // get value from input element
    var cityInput = cityInputEl.value.trim();
    console.log(cityInput);

    // if truthy, run getCity and clear input field, otherwise alert user
    if (cityInput) {
        getCity(cityInput);

        // clear old content
        searchTermEl.textContent = "";
    } else {
        alert("Please enter a city");
    }
};


var getCity = function(city) {
    console.log("function was called")
    //format the Geocoding api url
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" 
    + city.replace(" ","%20") 
    + "&APPID=2ca732745c4860a1e30f12f65cec56c5"; 
    console.log(apiUrl);

    // make a request to the url
    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                console.log(response);
                response.json().then(function(data) {
                    console.log(data);
                    displayCity(data, city);
                });
            } else {
                alert(`Error: ${response.statusText}`);
            }
        })
        .catch(function(error) {
            // Notice this `.catch()` getting chained onto the end of the `.then()` method
            alert("Unable to connect to GitHub");
        });
};

var displayCity = function (city, searchTerm) {
    // check if api returned any cities
    if (city.length===0) {
        searchTermEl.textContent = "City not found.";
        return;
    }
    // clear old content
    

}


userFormEl.addEventListener("submit", formSubmitHandler);

