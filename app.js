document.addEventListener("DOMContentLoaded", function() {
    const apiKey = "SJBOE0bAFHAhnGxNly3mxozrgVUGXSS3";
    const form = document.getElementById("cityForm");
    const weatherDiv = document.getElementById("weather");
    const daysDiv = document.getElementById("days");
    const hourDiv = document.getElementById("hour");

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const city = document.getElementById("cityInput").value;
        getWeather(city);
    });

    function getWeather(city) {
        const locationUrl = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${city}`;

        fetch(locationUrl)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const locationKey = data[0].Key;
                    fetchCurrentWeather(locationKey);
                    fetchDailyForecasts(locationKey, 5);
                    fetchHourlyForecast(locationKey);
                } else {
                    weatherDiv.innerHTML = `<p>City not found.</p>`;
                    daysDiv.innerHTML = '';
                    hourDiv.innerHTML = '';
                }
            })
            .catch(error => {
                console.error("Error fetching location data:", error);
                weatherDiv.innerHTML = `<p>Error fetching location data.</p>`;
                daysDiv.innerHTML = '';
                hourDiv.innerHTML = '';
            });
    }

    function fetchCurrentWeather(locationKey) {
        const currentWeatherUrl = `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}`;

        fetch(currentWeatherUrl)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    displayCurrentWeather(data[0]);
                } else {
                    weatherDiv.innerHTML = `<p>No current weather data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching current weather data:", error);
                weatherDiv.innerHTML = `<p>Error fetching current weather data.</p>`;
            });
    }

    function displayCurrentWeather(data) {
        const temperature = data.Temperature.Metric.Value;
        const weather = data.WeatherText;
        const weatherContent = `
            <h2>Weather</h2>
            <p>Temperature: ${temperature}°C</p>
            <p>Weather: ${weather}</p>
        `;
        weatherDiv.innerHTML = weatherContent;
    }

    function fetchDailyForecasts(locationKey, numberOfDays) {
        const dailyForecastsUrl = `http://dataservice.accuweather.com/forecasts/v1/daily/${numberOfDays}day/${locationKey}?apikey=${apiKey}&metric=true`;

        fetch(dailyForecastsUrl)
            .then(response => response.json())
            .then(data => {
                if (data && data.DailyForecasts && data.DailyForecasts.length > 0) {
                    displayDailyForecasts(data.DailyForecasts);
                } else {
                    daysDiv.innerHTML = `<p>No daily forecasts available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching daily forecasts:", error);
                daysDiv.innerHTML = `<p>Error fetching daily forecasts.</p>`;
            });
    }

    function displayDailyForecasts(dailyForecasts) {
        let forecastContent = `<h2>${dailyForecasts.length} Days Daily Forecasts</h2>`;
        dailyForecasts.forEach(forecast => {
            const date = new Date(forecast.Date);
            const dayWeather = forecast.Day.IconPhrase;
            const nightWeather = forecast.Night.IconPhrase;
            forecastContent += `
                <div>
                    <p>Date: ${date.toDateString()}</p>
                    <p>Day Weather: ${dayWeather}</p>
                    <p>Night Weather: ${nightWeather}</p>
                </div>
            `;
        });
        daysDiv.innerHTML = forecastContent;
    }

    function fetchHourlyForecast(locationKey) {
        const hourlyForecastUrl = `http://dataservice.accuweather.com/forecasts/v1/hourly/1hour/${locationKey}?apikey=${apiKey}&metric=true`;

        fetch(hourlyForecastUrl)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    displayHourlyForecast(data[0]);
                } else {
                    hourDiv.innerHTML = `<p>No hourly forecast available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching hourly forecast:", error);
                hourDiv.innerHTML = `<p>Error fetching hourly forecast.</p>`;
            });
    }

    function displayHourlyForecast(hourlyForecast) {
        const temperature = hourlyForecast.Temperature.Value;
        const weather = hourlyForecast.IconPhrase;
        const dateTime = new Date(hourlyForecast.DateTime);
        const forecastContent = `
            <h2>Hourly Forecasts</h2>
            <p>Time: ${dateTime.toLocaleTimeString()}</p>
            <p>Temperature: ${temperature}°C</p>
            <p>Weather: ${weather}</p>
        `;
        hourDiv.innerHTML = forecastContent;
    }
});
