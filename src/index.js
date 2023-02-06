function formatDate(date) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];

  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }

  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let time = `${hours}:${minutes}`;
  // getMinutes will look funny if the minutes are less than 10. will look like 10:1
  return `${day} ${time}`;
}

function formatDay (timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return days[day]; 
}

let dateAndTime = document.querySelector("#day-and-time");
let now = new Date();

dateAndTime.innerHTML = formatDate(now);

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#future-forecast");

  let forecastHTML = `<div class=row>`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 7 && index > 0)
    forecastHTML =
      forecastHTML +
      ` <div class="col-2">
            <p class="days">${formatDay(forecastDay.time)}</p>
             <img
              src="http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${forecastDay.condition.icon}.png"
              alt="sunny"
              class="forecast-img"
            />
            <p class="degrees"><strong>${Math.round(forecastDay.temperature.maximum)}</strong>|${Math.round(forecastDay.temperature.minimum)}</</p>
          </div>`;
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  console.log(coordinates);
  let apiKey = "357fa6804fb66f49to1c2af78b9974ad";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${coordinates.longitude}&lat=${coordinates.latitude}&key=${apiKey}&units=imperial`;
  console.log(apiUrl);
  axios.get(apiUrl).then(displayForecast);
}

function getCurrentWeather(response) {
  let iconElement = document.querySelector("#large-icon");
  let temperatureElement = document.querySelector("#temperature");
  let cityElement = document.querySelector("#current-city");
  let humidityElement = document.querySelector("#humidity");
  let windElement = (document.querySelector("#wind").innerHTML = ` ${Math.round(
    response.data.wind.speed
  )}`);
  let descriptionElement = document.querySelector("#weather-description");
  let weatherIcon = response.data.condition.icon;

  fahrenheitTemperature = response.data.temperature.current;

  descriptionElement.innerHTML = response.data.condition.description;
  windElement.innerHTML = ` ${Math.round(response.data.wind.speed)}`;
  humidityElement.innerHTML = ` ${response.data.temperature.humidity}`;
  cityElement.innerHTML = response.data.city;
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
  iconElement.setAttribute(
    "src",
    `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
  );

  // Clean this up below with a new function

  if (weatherIcon === "clear-sky-day") {
    document.getElementById("background").style.background =
      "radial-gradient(circle at -2.2% -3.8%, rgba(255, 227, 2, 0.41) 0%, rgb(59, 188, 241) 100.2%)";
  } else if (weatherIcon === "few-clouds-day") {
    document.getElementById("background").style.background =
      "linear-gradient(to top, #fff1eb 0%, #ace0f9 100%)";
  } else if (weatherIcon === "rain-day" || weatherIcon === "shower-rain-day") {
    document.getElementById("background").style.background =
      "linear-gradient(45deg, #93a5cf 0%, #e4efe9 100%)";
  } else if (
    weatherIcon === "broken-clouds-day" ||
    weatherIcon === "scattered-clouds-day"
  ) {
    document.getElementById("background").style.background =
      "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)";
  } else if (weatherIcon === "thunderstorm-day") {
    document.getElementById("background").style.background =
      "linear-gradient(180.3deg, rgb(221, 221, 221) 5.5%, rgb(110, 136, 161) 90.2%)";
  } else if (weatherIcon === "snow-day" || weatherIcon === "mist-day") {
    document.getElementById("background").style.background =
      "linear-gradient(109.6deg, rgb(245, 239, 249) 30.1%, rgb(207, 211, 236) 100.2%)";
  } else {
    document.getElementById("background").style.background =
      "radial-gradient(circle at -4% -12.9%, rgb(74, 98, 110) 0.3%, rgb(30, 33, 48) 90.2%)";
  }

  getForecast(response.data.coordinates);
}

function searchCity(query) {
  let apiKey = "357fa6804fb66f49to1c2af78b9974ad";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${query}&key=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(getCurrentWeather);
}

function submitCity(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  searchCity(city);
}

function searchLocation(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiKey = "357fa6804fb66f49to1c2af78b9974ad";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?lon=${lon}&lat=${lat}&key=${apiKey}&units=imperial`;

  axios.get(apiUrl).then(getCurrentWeather);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", submitCity);

let currentLocationButton = document.querySelector("#button-addon3");
currentLocationButton.addEventListener("click", getCurrentLocation);

searchCity("Miami");
