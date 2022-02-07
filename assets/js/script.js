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