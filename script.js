// Your apikey here
var APIKey = config.My_Weather_Key;

var city = "Seattle"
var queryURL = "";
var lat;
var lon;
var cardBodies = [$("#cardBody1"), $("#cardBody2"), $("#cardBody3"), $("#cardBody4"), $("#cardBody5")];
var weather2save = [];
// Using moment to add the date
var currentDay = moment().format("l");

if (localStorage.getItem("savedWeather") !== null) {
    var savedWeather = JSON.parse(localStorage.getItem("savedWeather"));
    for (var i = 0; i < savedWeather.length; i++) {
        city = savedWeather[i];
        createCityBtn();
    }
    weather2save = savedWeather;
    city = savedWeather[savedWeather.length - 1];
    getLatandLon();
} else {
    getLocation();
}

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

function createCityBtn() {
    var newCityBtn = $("<button>");
    newCityBtn.attr("type", "button");
    newCityBtn.attr("class", "list-group-item list-group-item-action active");
    newCityBtn.attr("id", "cityBtn");
    newCityBtn.text(city);
    $(".list-group").append(newCityBtn);
}

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

function existingCityBtn() {
    if ($("button").hasClass("active")) {
        $("button").removeClass("active");
    }
    city = $(this).text();
    $(this).addClass("active");
    
    getLatandLon();
}

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

$(document).on("click", "#cityBtn", existingCityBtn);