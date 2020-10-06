
//  current forecast
// api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}

//5 day forecast
// api.openweathermap.org/data/2.5/forecast?q={city name}&appid={API key}

//api key 6cb2a23a9b317017bf903187469c1c65



$(document).ready(function () {
    


   $("#search-button").on("click",function() {
    var apiKey = "6cb2a23a9b317017bf903187469c1c65";
    var cityName = $("#search-field").val();
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" 
    + cityName 
    + "&appid="
    + apiKey
    + "&units=imperial";

    console.log(queryURL);


    $.ajax({
        url: queryURL,
        method: "GET"
        }).then(function(response) {
        console.log(response);
   }) 
    
console.log("the search button was clicked");
console.log(cityName);
    

    //   var objStr = JSON.stringify(response);

    
  });
});