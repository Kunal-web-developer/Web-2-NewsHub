const apiKey = '2b237255cdb1f8852d669911556088a1';
const city = 'India';
const apiUrl = `http://api.weatherstack.com/current?access_key=${apiKey}&query=${city}`;

fetch(apiurl)
    .then(response => response.json())
    .then(data => {
        const weatherInfo = `
        <h2>${data.location.name}, ${data.location.country}</h2>
        <p>Temperature: ${data.current.temperature} °C</p>
        <p>Weather: ${data.current.weather_descriptions[0]}</p>
      `;
      document.getElementById('weather-info').innerHTML = weatherInfo;

    })
    .catch(error => console.error('Error fetching the weather data:', error));