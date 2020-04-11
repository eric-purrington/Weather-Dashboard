// Your apikey here
var APIKey = config.My_Weather_Key;

var city = "Seattle"
var queryURL = "";
var lat;
var lon;
var cardBodies = [$("#cardBody1"), $("#cardBody2"), $("#cardBody3"), $("#cardBody4"), $("#cardBody5")];
// Using moment to add the date
var currentDay = moment().format("L");

getLatandLon();

$("#button-addon2").on("click", function (event) {
    event.preventDefault();
    if ($("button").hasClass("active")) {
        $("button").removeClass("active")
    }
    city = $("#newCity").val();
    city = city.charAt(0).toUpperCase() + city.slice(1);
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
        $("button").removeClass("active")
    }
    city = $(this).text();
    $(this).addClass("active");
    
    getWeather();
}

function getWeather() {
    $(".empty").empty();
    $(".uviColor").attr("id", "");
    queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + APIKey

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

    // Current Weather
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
        
    getuviColor(response.current.uvi);
        
    // Forecast
    for (var i = 0; i < cardBodies.length; i++) {
        var day = moment().add(i + 1, "days").format("L");
        var cardTitle = $("<h6>");
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
    });
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