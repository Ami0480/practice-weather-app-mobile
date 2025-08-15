let iconMap = {
  "01d":
    "https://basmilius.github.io/weather-icons/production/line/all/clear-day.svg",
  "01n":
    "https://basmilius.github.io/weather-icons/production/line/all/clear-night.svg",
  "02d":
    "https://basmilius.github.io/weather-icons/production/line/all/overcast.svg",
  "02n":
    "https://basmilius.github.io/weather-icons/production/line/all/overcast-night.svg",
  "03d":
    "https://basmilius.github.io/weather-icons/production/line/all/overcast.svg",
  "03n":
    "https://basmilius.github.io/weather-icons/production/line/all/overcast-night.svg",
  "04d":
    "https://basmilius.github.io/weather-icons/production/line/all/overcast.svg",
  "04n":
    "https://basmilius.github.io/weather-icons/production/line/all/overcast.svg",
  "09d":
    "https://basmilius.github.io/weather-icons/production/line/all/drizzle.svg",
  "09n":
    "https://basmilius.github.io/weather-icons/production/line/all/drizzle.svg",
  "10d":
    "https://basmilius.github.io/weather-icons/production/line/all/rain.svg",
  "10n":
    "https://basmilius.github.io/weather-icons/production/line/all/rain.svg",
  "11d":
    "https://basmilius.github.io/weather-icons/production/line/all/thunderstorms.svg",
  "11n":
    "https://basmilius.github.io/weather-icons/production/line/all/thunderstorms.svg",
  "13d":
    "https://basmilius.github.io/weather-icons/production/line/all/snow.svg",
  "13n":
    "https://basmilius.github.io/weather-icons/production/line/all/snow.svg",
  "50d":
    "https://basmilius.github.io/weather-icons/production/line/all/mist.svg",
  "50n":
    "https://basmilius.github.io/weather-icons/production/line/all/mist.svg",
};

function showElement(response) {
  let searchCity = document.querySelector("#city");
  let temperatureElement = document.querySelector("#temperature");
  let temperature = response.data.main.temp;
  let descriptionElement = document.querySelector("#description");
  let timeElement = document.querySelector("#time");
  let dt = response.data.dt;
  let timezone = response.data.timezone;
  let date = new Date((dt + timezone) * 1000);
  let iconElement = document.querySelector("#icon");
  let iconCode = response.data.weather[0].icon;
  let iconAnimation = iconMap[iconCode];

  searchCity.innerHTML = response.data.name;
  temperatureElement.innerHTML = Math.round(temperature);
  descriptionElement.innerHTML = response.data.weather[0].description;
  timeElement.innerHTML = formatDate(date);
  iconElement.innerHTML = `<img
    src="${iconAnimation}"
    class="current-img"
     />
`;
}

function formatDate(date) {
  let hour = date.getUTCHours();
  let minute = date.getUTCMinutes();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getUTCDay()];

  if (hour < 10) hour = `0${hour}`;
  if (minute < 10) minute = `0${minute}`;
  return `${day} ${hour}:${minute}`;
}

function forecastShowElement(response) {
  let forecastList = response.data.list;

  let dailyForecasts = forecastList.filter((forecast) =>
    forecast.dt_txt.includes("12:00:00")
  );

  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = "";

  dailyForecasts.forEach((forecast) => {
    let date = new Date(forecast.dt * 1000);
    let day = date.toLocaleDateString("en-AU", { weekday: "short" });
    let icon = forecast.weather[0].icon;
    icon = icon.replace("n", "d");
    let iconUrl = iconMap[icon];
    let temp = Math.round(forecast.main.temp);

    forecastElement.innerHTML += `
      <div class="forecast-details">
       <div class="forecast-day">${day}</div>
       <img
        src="${iconUrl}"
        class="forecast-img"
        />
       <div class="forecast-temp">${temp}°C</div>
      </div>`;
  });
  console.log(response.data);
}

function displayCity(city) {
  let apiKey = "d1193959d2d841ec7555416d715716a6";
  let currentWeatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  let forecastWeatherApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  document.querySelector("#loading").style.display = "block";

  axios.get(currentWeatherApiUrl).then(showElement);
  axios
    .get(forecastWeatherApiUrl)
    .then(forecastShowElement)
    .catch(() => {
      alert("City not found. Please check the spelling..");
    })
    .finally(() => (document.querySelector("#loading").style.display = "none"));
}

function searchForCity(event) {
  event.preventDefault();

  let searchInput = document.querySelector("#search-form-input");

  displayCity(searchInput.value);
}

let searchElementCity = document.querySelector("#search-form");
searchElementCity.addEventListener("submit", searchForCity);

displayCity("Perth");
