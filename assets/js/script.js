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
          
          
          var uv = data.current.uvi
          var uvBox = $("#current-uv-index")
          uvBox.text(`UV Index: ${uv}`)
          uvBox.removeClass("w3-green w3-red w3-yellow")
          // COLORS OF UV VALUES
          if (uv < 3) {
            uvBox.addClass("w3-green")
          } else if (uv > 7) {
            uvBox.addClass("w3-red")
          } else {
            uvBox.addClass("w3-yellow")
          }

          //CLEAR THE LAST FORECAST
          $(".forecast").empty()

          //FORECAST WEATHER CONDITIONS

          $("#five-day-header").text("5-Day Forecast:")
    
          for (var i = 1; i < 6; i++) {
            var fiveDayDate = moment.unix(data.daily[i].dt).format('LL')
            var fiveDayTemp = data.daily[i].temp.day;
            var fiveDayWind = data.daily[i].wind_speed;
            var fiveDayHumidity = data.daily[i].humidity;
            var fiveDayIcon = data.daily[i].weather[0].icon;

            var weatherIcon = document.createElement("img")
            weatherIcon.setAttribute("src",`http://openweathermap.org/img/wn/${fiveDayIcon}.png`)

            //ADDING TEXT AND FORMATTING TO FORECAST BOXES
            $(".forecast").addClass("w3-card w3-blue")

            var forecastBox = document.createElement("div")
            forecastBox.id = `weather-day-${[i]}`
            forecastBox.classList.add("w3-card", "w3-blue" )
            var forecastDate = document.createElement("h4")
            forecastDate.textContent = fiveDayDate
            var forecastTemp = document.createElement("p")
            forecastTemp.textContent = `Temp: ${fiveDayTemp}°F`
            var forecastWind = document.createElement("p")
            forecastWind.textContent = `Wind: ${fiveDayWind} MPH`
            var forecastHumidity = document.createElement("p")
            forecastHumidity.textContent = `Humidity: ${fiveDayHumidity}%`

            $("#day"+[i]).append(forecastDate, weatherIcon, forecastTemp, forecastWind, forecastHumidity)
          }          
        }).catch((error) => {
            console.log(error)
          })
        }
      })
    }
  }
  
//SEARCH BUTTON EVENT LISTENER
$("#searchBtn").on("click", function (e) {
    e.preventDefault()
    city = $("#searchBox").val()
     
  //CHECKING TO SEE IF CITY DATA IS IN ARRAY, NO? PUSH TO ARRAY WITH A NEW BUTTON
  if (pastCities.indexOf(city) == -1 && invalidEntry === false) {
    pastCities.push(city)
    //BUTTON CREATED
    var cityHistory = document.createElement("button")
    cityHistory.id = "saved-city"+pastCities.length
    cityHistory.classList.add("w3-button", "w3-gray", "w3-round", "saved-city")
    cityHistory.textContent = city
    
    $("#past-searches").append(cityHistory)
    
  }
  invalidEntry = false
  
  setLocalStorage()
  getCoordinates(city)
});

//SAVE PAST SEARCHES TO LOCAL STORAGE AND UPDATE ARRAY
const setLocalStorage = () => {
    for (var i = 0; i < pastCities.length; i++) {
      localStorage.setItem("savedSearches", JSON.stringify(pastCities));
    }
    pastCities = JSON.parse(localStorage.getItem("savedSearches"));
    return
  }
  
//CREATED EVENT LISTENER FOR PAST SEARCHES
$(".saved-city").on("click", function (e) {
    e.preventDefault()
    city = $(this).text()
    getCoordinates(city)
    
  });