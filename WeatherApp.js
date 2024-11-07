const searchButton = document.querySelector(".search-btn");
const cityInput = document.querySelector(".city-input");
const weatherCardDiv = document.querySelector(".weather-cards");
const API_KEY = "be637494f3dee6833ecc9a6eb03af457";

const createWeatherCard = (weatherItem) => {
    return `<li class="card"> 
                <h3>${weatherItem.dt_txt.split(" ")[0]}</h3>
                <img src="https://openweathermap.org/img/w/${weatherItem.weather[0].icon}.png">
                <h4>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)} °C</h4>
                <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
                <h4>Humidity: ${weatherItem.main.humidity}</h4>
            </li>`;
}

const getWeatherDetails = (cityName, lat, lon) => {
    const Weather_Api_Url = `https://api.openweathermap.org/data/2.5/forecast/?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    fetch(Weather_Api_Url)
        .then(res => res.json())
        .then(data => {
            const uniqueForecastDays = [];
            const fiveDaysForecast = data.list.filter(forecast => {
                const forecastDate = new Date(forecast.dt_txt).getDate();
                if (!uniqueForecastDays.includes(forecastDate)) {
                    return uniqueForecastDays.push(forecastDate);
                }
            });
            cityInput.value ="";
            weatherCardDiv.innerHTML ="";

            console.log(fiveDaysForecast);
            fiveDaysForecast.forEach(weatherItem => {
                weatherCardDiv.insertAdjacentHTML("beforeend", createWeatherCard(weatherItem));
            });

        })
        .catch(() => {
            alert("An error occurred while fetching the weather forecast");
        });
}

const getcityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if (!cityName) return;

    const GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${API_KEY}`;

    fetch(GEOCODING_API_URL)
        .then(res => res.json())
        .then(data => {
            if (!data.length) return alert(`No Coordinates found for ${cityName}`);
            const { name, lat, lon } = data[0];
            getWeatherDetails(name, lat, lon);
        })
        .catch(() => {
            alert("Error fetching coordinates. Please try again.");
        });
}

searchButton.addEventListener("click", getcityCoordinates);
