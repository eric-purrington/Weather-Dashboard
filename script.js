var APIKey = "ab2bf7c02d1d14b0e599494d46f5984d";

// initializing with some blank global variables as well as an array holding the card bodies
var city = ""
var queryURL = "";
var lat;
var lon;
var weather2save = [];
var cardBodies = [$("#cardBody1"), $("#cardBody2"), $("#cardBody3"), $("#cardBody4"), $("#cardBody5")];

// Using moment to add the date
var currentDay = moment().format("l");

// Fetches any saved data and creates buttons for those cities; or asks for current location to give a starter city
if (localStorage.getItem("savedWeather") !== null) {
    var savedWeather = JSON.parse(localStorage.getItem("savedWeather"));
    for (var i = 0; i < savedWeather.length; i++) {
        city = savedWeather[i];
        createCityBtn();
    }
    weather2save = savedWeather;
    city = savedWeather[savedWeather.length - 1];
    if ($("button").hasClass("active")) {
        $("button").removeClass("active");
    }
    getLatandLon();
} else {
    getLocation();
}

// Gets your location and gives the weather for it if allowed; if not allowed sets current city as Seattle
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            city = "Your Location";
            lat = position.coords.latitude;
            lon = position.coords.longitude;
            getWeather();
        }, function (error) {
            if (error.code == error.PERMISSION_DENIED) {
                city = "Seattle"
                createCityBtn();
                getLatandLon();
            }
        });
    }
}

// On search button click remove active class, makes new button, and saves that city to local storage
$("#button-addon2").on("click", function (event) {
    event.preventDefault();
    if ($("button").hasClass("active")) {
        $("button").removeClass("active");
    }
    city = $("#newCity").val();
    weather2save.push(city);
    localStorage.setItem("savedWeather", JSON.stringify(weather2save));
    createCityBtn();
    getLatandLon();
});

// Function to create new button
function createCityBtn() {
    var newCityBtn = $("<button>");
    newCityBtn.attr("type", "button");
    newCityBtn.attr("class", "list-group-item list-group-item-action active");
    newCityBtn.attr("id", "cityBtn");
    newCityBtn.text(city);
    $(".list-group").append(newCityBtn);
}

// If existing city button is clicked, will set that button's class to active and remove active from any other button
function existingCityBtn() {
    if ($("button").hasClass("active")) {
        $("button").removeClass("active");
    }
    city = $(this).text();
    $(this).addClass("active");
    
    // Starts weather string of functions
    getLatandLon();
}

// Function to get lat and lon so that we may put those in the "all in one" api call
function getLatandLon() {
    queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        lat = response.coord.lat;
        lon = response.coord.lon;
        getWeather();
    });
}

// Does weather api call
function getWeather() {
    $(".empty").empty();
    queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + APIKey

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
    // Current Weather
    getCurrentWeather(response);
    
    // UVIndex Color
    getuviColor(response.current.uvi);
        
    // Forecast
    getForecast(response);
    });
}

// Function for getting current weather of chosen city/your location
function getCurrentWeather(response) {
    var iconImg = $("<img>");
    iconImg.attr("src", "http://openweathermap.org/img/w/" + response.current.weather[0].icon + ".png");
    iconImg.attr("alt", "Weather Icon");

    $(".cityName").text(city + " (" + currentDay + ") ");
    $(".cityName").append(iconImg);
    $(".cityTemp").text("Temperature: " + response.current.temp + " \xB0F");
    $(".cityHumidity").text("Humidity: " + response.current.humidity + "%");
    $(".cityWind").text("Wind Speed: " + response.current.wind_speed + " MPH");
    $(".cityUV").text("UV Index : ");
    $(".uviColor").text(response.current.uvi);
}

// Function that sets the uv index color depending on danger levels
function getuviColor(uvi) {
    if (uvi <= 2.99) {
        $(".uviColor").attr("id", "uviLow");
    } else if (3.00 <= uvi && uvi <= 5.99) {
        $(".uviColor").attr("id", "uviModerate");
    } else if (6.00 <= uvi && uvi <= 7.99) {
        $(".uviColor").attr("id", "uviHigh");
    } else if (8.00 <= uvi && uvi <= 10.99) {
        $(".uviColor").attr("id", "uviVeryHigh");
    } else {
        $(".uviColor").attr("id", "uviExtreme");
    }
}

// Function for getting forecast of chosen city/your location
function getForecast(response) {
    for (var i = 0; i < cardBodies.length; i++) {
        var day = moment().add(i + 1, "days").format("l");
        var cardTitle = $("<h5>");
        var cardImg = $("<img>");
        var cardP1 = $("<p>");
        var cardP2 = $("<p>");

        cardTitle.attr("class", "card-title");
        cardP1.attr("class", "card-text");
        cardP2.attr("class", "card-text");

        cardTitle.text(day);
        cardImg.attr("src", "http://openweathermap.org/img/w/" + response.daily[i].weather[0].icon + ".png");
        cardP1.text("Temp: " + response.daily[i].temp.day + "\xB0 F");
        cardP2.text("Humidity: " + response.daily[i].humidity + "%");
        cardBodies[i].append(cardTitle, cardImg, cardP1, cardP2);
    }
}

// Makes sure that even if the button was created with js it can be clicked on
$(document).on("click", "#cityBtn", existingCityBtn);