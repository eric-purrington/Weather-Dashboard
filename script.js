var APIKey = "ab2bf7c02d1d14b0e599494d46f5984d";
var city = "Seattle,Washington"
var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;


$("#button-addon2").on("click", function () {
    city = $("#newCity").val();
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
    
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){
        $(".city").text("The city we are in " + response.name);
        $(".wind").text("Wind speed: " + response.wind.speed + " Wind direction: " + response.wind.deg);
        $(".humidity").text("Humidity: " + response.main.humidity);
        $(".temp").text("Temperature: " + Math.floor((response.main.temp - 273.15) * 1.8 + 32) + "F");
    });
});