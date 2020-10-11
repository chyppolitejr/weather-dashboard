
//  current forecast
// api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}

//5 day forecast
// api.openweathermap.org/data/2.5/forecast?q={city name}&appid={API key}

//api key 6cb2a23a9b317017bf903187469c1c65

// url to get icon returned in weather results

// http://openweathermap.org/img/wn/10d@2x.png

//http://open.mapquestapi.com/geocoding/v1/address?key=KEY&location=Washington,DC

$(document).ready(function () {
    
  var searchListEl = $(".list-group");
  var searchListItem = $("<li>");
  var searchListArray = new Array;

  // if (localStorage.length > 0) {
    for (i=0; i < localStorage.length;i++){
      // var searchListItemObj = JSON.parse(localStorage.getItem(i));

      searchListArray.push(JSON.parse(localStorage.getItem(i)))

      populateSearchList(i,searchListArray[i].city, searchListArray[i].state);

      console.log("i=" +i + "city: " + searchListArray[i].city + "state:" + searchListArray[i].state);
    }
  // } 
  console.log(localStorage);
  console.log(searchListArray);

// search button even listener
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

// // save previous search to local storage and to array
var strSearchListObj = {"city" : cityDisplayName ,"state" : stateDisplayName , "lat" : lat, "long" :long };
var localStorageLen = localStorage.length;
  localStorage.setItem(localStorageLen,JSON.stringify(strSearchListObj));
  searchListArray.push(strSearchListObj);



//   searchListItem.addClass("list-group-item");
//   searchListItem.text(cityName);
//   searchListEl.append(searchListItem);

// populateSearchList();

  // ajax call for forecast
  var queryURL="https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long
  + "&exclude=hourly,minutely,alerts&units=imperial"
  + "&appid="
  + apiKey;
  // console.log(queryURL);

  // api call for weather data
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
        var uvIDSpanClass;
        var imgEl = $("<img>");
        var pEl = $("<p>");
        // get icon from openweather.org
        var iconURL = "http://openweathermap.org/img/wn/"
        + icon 
        + ".png";

        // clear search list field
        $("#search-field").val("");

        // determine uv index rating 0-2 green, 3-5 yellow, 6-7 orange 8-10 red
        if (uvIndex <= 2){uvIDSpanClass = "bg-success"; }
        else if (uvIndex >= 3 && uvIndex <= 5){ uvIDSpanClass="bg-warning"}
        else if (uvIndex >= 6 && uvIndex <= 7){ uvIDSpanClass="bg-orange"}
        else (uvIDSpanClass="bg-danger");

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
       $("#forecast-details").append("<p>" + "UV Index: " + "<span class='" + uvIDSpanClass  + " rounded text-white'>" + uvIndex);
       
      //  console.log(response.current);
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
        
        fcastCardEl.empty();
        fcastCardImgEl.attr("src",currIco);
        console.log(currDt);
        fcastCardEl.append("<h5>" + currDt);
        fcastCardEl.append(fcastCardImgEl);
        fcastCardEl.append("<p>" + "Temperature: " + currTemp);
        fcastCardEl.append("<p>" + "Humidity: " + currHumidity);

    

      }

      // console.log(response.daily);
      
      
    
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

  function populateSearchList(i,city,state) {
     var displCityState = city + "," + state;
      searchListItem.addClass("list-group-item");
      searchListItem.attr("data-index",i);
      searchListItem.text(city + "," + state);
      searchListEl.append("<li " + "class='list-group-item'>" + displCityState );

      //console.log(localStorage.getItem(i));

  

  }
});

