// Your apikey here
var APIKey = config.My_Weather_Key;

var city = ""
var queryURL = "";
var lat;
var lon;

// Using moment to add the date
var currentDay = moment().format("L");


$("#button-addon2").on("click", function () {
    city = $("#newCity").val();
    city = city.charAt(0).toUpperCase() + city.slice(1);

    queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        lat = response.coord.lat;
        lon = response.coord.lon;
        getWeather();
    });
});

function getWeather() {
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
    $(".cityTemp").text("Temperature: " + response.current.temp + "\xB0 F");
    $(".cityHumidity").text("Humidity: " + response.current.humidity + "%");
    $(".cityWind").text("Wind Speed: " + response.current.wind_speed + "MPH");
    $(".cityUV").text("UV Index : ");
    $(".uviColor").text(response.current.uvi);
        
    if (response.current.uvi <= 2.99) {
        $(".uviColor").attr("id", "uviLow");
    } else if (3.00 <= response.current.uvi <= 5.99) {
        $(".uviColor").attr("id", "uviModerate");
    } else if (6.00 <= response.current.uvi <= 7.99) {
        $(".uviColor").attr("id", "uviHigh");
    } else if (8.00 <= response.current.uvi <= 10.99) {
        $(".uviColor").attr("id", "uviVeryHigh");
    } else if (11 <= response.current.uvi) {
        $(".uviColor").attr("id", "uviExtreme");
    }
    
    // Forecast
    for (var i = 0; i < 5; i++) {
        var day = moment().add(i + 1, "days").calendar();
        var iconImg = $("<img>");
        iconImg.attr("src", "http://openweathermap.org/img/w/" + response.daily[i].weather[0].icon + ".png");
        $(".cityTemp").text("Temperature: " + response.current.temp + "\xB0 F");
        $(".cityHumidity").text("Humidity: " + response.current.humidity + "%");
    } 
        var cardTitle = $("<h5>");
        var cardImg = $("<img>");
        var cardP1 = $("<p>");
        var cardP2 = $("<p>");
        cardTitle.text(day);
        cardImg.attr("src", "http://openweathermap.org/img/w/" + response.daily[i].weather[0].icon + ".png");
        cardP1.text("Temp: " + response.daily[i].temp.day + "\xB0 F");
        cardP2.text("Humidity: " + response.daily[i].humidity + "%");
        append(this, that, me, you)
    });
}