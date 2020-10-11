
//  current forecast
// api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}

//5 day forecast
// api.openweathermap.org/data/2.5/forecast?q={city name}&appid={API key}

//api key 6cb2a23a9b317017bf903187469c1c65

// url to get icon returned in weather results

// http://openweathermap.org/img/wn/10d@2x.png

//http://open.mapquestapi.com/geocoding/v1/address?key=KEY&location=Washington,DC

$(document).ready(function () {
    


   $("#search-button").on("click",function() {
    var apiKey = "6cb2a23a9b317017bf903187469c1c65";
    var cityName = $("#search-field").val();
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" 
    + cityName 
    + "&appid="
    + apiKey
    + "&units=imperial";

    



//grab lat and long first
var apiKeyMapquest = "H8AvlVgtzwatdyOwNXLQ3WxMwM9Wh5AY";
var mqURL = "http://open.mapquestapi.com/geocoding/v1/address?key=" + apiKeyMapquest + "&location=" + cityName;
var lat;
var long;
var cityDisplayName;
var stateDisplayName;
var searchListEl = $("#search-list");
var searchListItem = $("<li>");

//  make call to grab lat and long so we only have to make one call to openweather
$.ajax({
  url: mqURL,
  method: "GET"
}).then(function(response){
  console.log(response);
  lat = response.results[0].locations[0].latLng.lat;
  long = response.results[0].locations[0].latLng.lng;
  cityDisplayName = response.results[0].locations[0].adminArea5;
  stateDisplayName = response.results[0].locations[0].adminArea3;

// save previous search to local storage
  localStorage.setItem(cityName,JSON.stringify(response.results[0].locations[0].latLng));



  searchListItem.addClass("list-group-item");
  searchListItem.text(cityName);
  searchListEl.append(searchListItem);

  // ajax call for forecast
  var queryURL="https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long
  + "&exclude=hourly,minutely,alerts&units=imperial"
  + "&appid="
  + apiKey;
  console.log(queryURL);

  $.ajax({
    url: queryURL,
    method: "GET"
    }).then(function(response) {
        var cityStateDisplay  = cityDisplayName + ", " + stateDisplayName;
        var icon = response.current.weather[0].icon;
        var wind = response.current.wind_speed;
        var temp = response.current.temp;
        var feelsLike = response.current.feels_like;
        var humidity = response.current.humidity;
        var uvIndex = response.current.uvi;
        var imgEl = $("<img>");
        var pEl = $("<p>");
        // get icon from openweather.org
        var iconURL = "http://openweathermap.org/img/wn/"
        + icon 
        + ".png";
//  add icon to page
        imgEl.attr("src",iconURL);

       $("#forecast-name").empty();
       $("#forecast-name").text(cityStateDisplay + " (" + moment().format('l') + ")");
       $("#forecast-name").append(imgEl);

       $("#forecast-details").empty();
       $("#forecast-details").append("<p>" + "Temperature: " + temp + "&deg; F");
       $("#forecast-details").append("<p>" + "Feels Like: " + feelsLike + "&deg; F");
       $("#forecast-details").append("<p>" + "Humidity: " + humidity + "&percnt;");   
       $("#forecast-details").append("<p>" + "Wind Speed: " + wind + " mph");
       $("#forecast-details").append("<p>" + "UV Index: " + "<span class='bg-danger rounded text-white'>" + uvIndex);
       
       console.log(response.current);
      //  5 day forecast section
      for (i=0;i<5;i++){
        var unixTS = response.daily[i].dt;
        var currDt = timeConverter(unixTS);
        var currIco = "http://openweathermap.org/img/wn/" + response.daily[i].weather[0].icon + ".png";
        var currTemp = response.daily[i].temp.day + "&deg;" + " F";
        var currHumidity = response.daily[i].humidity + "&percnt;";
        var cardId = "#card-" +i;
        var fcastCardEl = $(cardId);
        // var fcastCardTitle = $("")
        var fcastCardImgEl = $("<img>");
        var fcastCardText = $(".card-text-" + i)
        
        fcastCardImgEl.attr("src",currIco);
        console.log(currDt);
        fcastCardEl.append("<h5>" + currDt);
        fcastCardEl.append(fcastCardImgEl);
        fcastCardEl.append("<p>" + "Temperature: " + currTemp);
        fcastCardEl.append("<p>" + "Humidity: " + currHumidity);

    

      }

      console.log(response.daily);
      
      
    
    })
})



    
  });

  function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    // var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = a.getMonth();
    var date = a.getDate();
    // var hour = a.getHours();
    // var min = a.getMinutes();
    // var sec = a.getSeconds();
    var time =  month + "/" + date + "/" + year
    return time;
  }
});

