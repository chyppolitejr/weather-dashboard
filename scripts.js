
//  current forecast
// api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}

//5 day forecast
// api.openweathermap.org/data/2.5/forecast?q={city name}&appid={API key}

//api key 6cb2a23a9b317017bf903187469c1c65

// url to get icon returned in weather results

// http://openweathermap.org/img/wn/10d@2x.png


$(document).ready(function () {
    


   $("#search-button").on("click",function() {
    var apiKey = "6cb2a23a9b317017bf903187469c1c65";
    var cityName = $("#search-field").val();
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" 
    + cityName 
    + "&appid="
    + apiKey
    + "&units=imperial";

    // console.log(queryURL);


    $.ajax({
        url: queryURL,
        method: "GET"
        }).then(function(response) {
        console.log(response);

        var respName = response.name;
        var icon = response.weather[0].icon;
        var wind = response.wind.speed;
        var temp = response.main.temp;
        var humidity = response.main.humidity;
        var imgEl = $("<img>");
        var pEl = $("<p>");
          
        

        var iconURL = "http://openweathermap.org/img/wn/"
        + icon 
        + ".png";

        imgEl.attr("src",iconURL);

       $("#forecast-name").empty();
       $("#forecast-name").text(respName + " (" + moment().format('l') + ")");
       $("#forecast-name").append(imgEl);

       $("#forecast-details").empty();
       $("#forecast-details").append("<p>" + "Temperature: " + temp + "&deg; F");
       $("#forecast-details").append("<p>" + "Humidity: " + humidity + "&percnt;");   
       $("#forecast-details").append("<p>" + "Wind Speed: " + wind + " mph");




      //  API Call for UV Index using lat and lon
      var lat = response.coord.lat;
      var lon = response.coord.lon;
      var queryURLuv = "http://api.openweathermap.org/data/2.5/uvi?lat="
      + lat 
      + "&lon="
      + lon 
      + "&appid="
      + apiKey;

      $.ajax({
        url: queryURLuv,
        method: "GET"
        }).then(function(response) {
        
        $("#forecast-details").append("<p>" + "UV Index: " + "<span class='bg-danger rounded text-white'>" + response.value);


        })

  
   }) 
    

    

    //   var objStr = JSON.stringify(response);

    
  });
});