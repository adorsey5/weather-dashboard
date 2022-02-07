//set API KEY
var apiKey = 'f67aad61985716e3b2e0c431759ef5b4' 
var invalidEntry = false

//load data to pastCities, if no data exists see empty array
var pastCities = JSON.parse(localStorage.getItem("savedSearches"));
if (!pastCities) { pastCities = []}
for (var i = 0; i < pastCities.length; i++) {
  var cityHistory = document.createElement("button")
  cityHistory.id = "saved-city" + [i]
  cityHistory.classList.add("w3-button", "w3-gray", "w3-round", "saved-city")
  cityHistory.textContent = pastCities[i]
  $("#past-searches").append(cityHistory)
  
}

//CITY AND COORDINATES TO RETRIEVE getUV API call
const getCoordinates = (city) => {

    var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units&appid=${apiKey}`
  
    fetch(apiURL).then(function (response) {
      if (response.ok) // returns true if the response returned successfully
      {
        response.json().then(function (data) {
          var lat = data.coord.lat
          var long = data.coord.lon
          var cityName = data.name
          getUV(lat, long, cityName);    
         })
      } else {
        alert("Invalid City Name, please try again!")
        invalidEntry = true
        
      }
    }).catch((error) => {
      console.log(error)
    })
  }
  //RETRIEVED CITY LATITUDE AND LONGITUDE FOR UVINDEX
const getUV = (lat, long, cityName) => {
    if (lat && long) {
      var apiURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&units=imperial&exclude=hourly,minutely,alerts&appid=${apiKey}`
  
      fetch(apiURL).then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            
          //CURRENT CITY INFO UPDATED
          var todaysDate = moment.unix(data.current.dt).format('LL')
          var weatherIcon = data.current.weather[0].icon;
          var icon = document.createElement("img")
          icon.setAttribute("src",`http://openweathermap.org/img/wn/${weatherIcon}.png`)
          $("#currentCity").text(`${cityName} (${todaysDate})`)
          $("#currentCity").append(icon)

          //ADDED BORDER IN DIV
          $("#forecast-today").addClass("w3-border")

          //CURRENT CITY FORECAST CONDITIONS
          var temp = data.current.temp;
          var wind = data.current.wind_speed;
          var humidity = data.current.humidity;

          $("#current-temp").text(`Temp: ${temp}°F`);
          $("#current-wind").text(`Wind: ${wind} MPH`);
          $("#current-humidity").text(`Humidity: ${humidity}%`);
