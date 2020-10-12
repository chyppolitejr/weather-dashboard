$(document).ready(function () {
    
  var searchListEl = $(".list-group");
  var searchListItem = $("<li>");
  var searchListArray = new Array;
  var cityDisplayName;
  var stateDisplayName;
  var lastSearchURL;
  var lastSearchCity;
  var lastSearchState;
  var maxArrayI;



// checking localstorage for values and will only run when there are
  if (localStorage.length > 0) {
    for (i=0; i < localStorage.length;i++){
    

      searchListArray.push(JSON.parse(localStorage.getItem(i)))

      populateSearchList(i,searchListArray[i].city, searchListArray[i].state);

      // console.log(searchListArray);
    }

    maxArrayI = searchListArray.length-1;
    // console.log(maxArrayI);
    // console.log(searchListArray[maxArrayI].apiURL);
    lastSearchURL = searchListArray[maxArrayI].apiURL;
    lastSearchCity = searchListArray[maxArrayI].city;
    lastSearchState = searchListArray[maxArrayI].state;

    //  run last search every time page loads
    runWeatherSearch(lastSearchURL,lastSearchCity,lastSearchState);

  } 
  // console.log(localStorage);
  // console.log(searchListArray);

  //  listen for search list clicks
  var listGroupEl = $(".list-group");

  listGroupEl.on("click","li", function(event) {

    event.preventDefault()
    var clickedVal = $(this);


    // changes active item to one just clicked
    $("li").removeClass("active");
    $(this).addClass("active");

    // console.log("you clicked something :" + clickedVal.text() );
    var searchIndexVal = clickedVal.attr("data-index");
    var clickedItemURL;
    var clickedItemCity;
    var clickedItemState;

    // console.log("data index of clicked item is " + searchIndexVal)

    clickedItemURL = searchListArray[searchIndexVal].apiURL;
    clickedItemCity = searchListArray[searchIndexVal].city;
    clickedItemState = searchListArray[searchIndexVal].state;

    // console.log("apiUrl is " + clickedItemURL);
    // console.log("clicked city is " + clickedItemCity);
    // console.log("clicked state is " + clickedItemState);

    runWeatherSearch(clickedItemURL,clickedItemCity,clickedItemState);

  });



// search button event listener
   $("#search-button").on("click",function() {
  
    var apiKey = "6cb2a23a9b317017bf903187469c1c65";
    var cityName = $("#search-field").val();
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" 
    + cityName 
    + "&appid="
    + apiKey
    + "&units=imperial";


    //  make call to grab lat and long so we only have to make one call to openweather
    $.ajax({
      url: mqURL,
      method: "GET"
    }).then(function(response){
      // console.log(response);
      lat = response.results[0].locations[0].latLng.lat;
      long = response.results[0].locations[0].latLng.lng;
      cityDisplayName = response.results[0].locations[0].adminArea5;
      stateDisplayName = response.results[0].locations[0].adminArea3;


    // populateSearchList();

      // ajax call for forecast
      var queryURL="https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long
      + "&exclude=hourly,minutely,alerts&units=imperial"
      + "&appid="
      + apiKey;
      // console.log(queryURL);

      // // save previous search to local storage and to array
    var strSearchListObj = {"city" : cityDisplayName ,"state" : stateDisplayName , "apiURL" : queryURL };
    var localStorageLen = localStorage.length;

      localStorage.setItem(localStorageLen,JSON.stringify(strSearchListObj));
      searchListArray.push(strSearchListObj);


      // api call for weather data
    runWeatherSearch(queryURL,cityDisplayName,stateDisplayName);
    populateSearchList(localStorageLen,cityDisplayName, stateDisplayName);

    })
    
  });



  function populateSearchList(i,city,state) {
     var displCityState = city + "," + state;
     var listItemEl = $("<li>");
     listItemEl.addClass("list-group-item list-group-item-action");
     listItemEl.attr("data-index",i);
     listItemEl.attr("data-toggle","list");
     listItemEl.attr("role","tab"); 
     listItemEl.text(displCityState);

      // searchListItem.addClass("list-group-item");
      // searchListItem.attr("data-index",i);
      // searchListItem.text(city + "," + state);
      //searchListEl.append("<li " + "class='list-group-item'>" + displCityState );
      searchListEl.append(listItemEl);

      //console.log(localStorage.getItem(i));

  }
});

function runWeatherSearch (URL,city,state) {
  //  make call to grab lat and long so we only have to make one call to openweather
  $.ajax({
    url: URL,
    method: "GET"
    }).then(function(response) {
        var cityStateDisplay  = city + ", " + state;
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
        //$("#search-field").val("");

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
        // console.log(currDt);
        fcastCardEl.append("<h5>" + currDt);
        fcastCardEl.append(fcastCardImgEl);
        fcastCardEl.append("<p>" + "Temperature: " + currTemp);
        fcastCardEl.append("<p>" + "Humidity: " + currHumidity);

    

      }

      // console.log(response.daily);
      
      
    
    })

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
}
// listEl.addEventListener("click", function(event) {
//   event.preventDefault();
//   if(event.target.matches("button")) {
//     var item = document.createElement("div");
//     item.textContent = groceries[event.target.parentElement.id];
//     shoppingCartEl.append(item);
//   }
// });

