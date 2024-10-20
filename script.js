const apiKey = '2a57e1e4c13eb0579d5b5f223462a126'; // Replace with your OpenWeatherMap API key

let isCelsius = true; // Track temperature unit

// Function to fetch weather data by city name
async function fetchWeather(city) {
    showLoading();
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (response.ok) {
            updateWeatherCard(data);
            hideErrorMessage();
        } else {
            showErrorMessage('City not found. Please enter a valid city.');
        }
    } catch (error) {
        showErrorMessage('An error occurred. Please try again later.');
    } finally {
        hideLoading();
    }
}

// Function to show loading spinner
function showLoading() {
    document.getElementById('loading').classList.remove('hidden');
}

// Function to hide loading spinner
function hideLoading() {
    document.getElementById('loading').classList.add('hidden');
}

// Function to show error message
function showErrorMessage(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
}

// Function to hide error message
function hideErrorMessage() {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.classList.add('hidden');
}

// Toggle between Celsius and Fahrenheit
document.getElementById('unitToggle').addEventListener('click', () => {
    isCelsius = !isCelsius;
    updateUnit();
});

// Function to update the displayed temperature unit
function updateUnit() {
    const temperatureElement = document.getElementById('temperature');
    const currentTemp = parseFloat(temperatureElement.textContent);

    if (isCelsius) {
        temperatureElement.textContent = `${Math.round((currentTemp - 32) * (5 / 9))}°`;
        document.getElementById('unitToggle').textContent = '°C';
    } else {
        temperatureElement.textContent = `${Math.round((currentTemp * (9 / 5)) + 32)}°`;
        document.getElementById('unitToggle').textContent = '°F';
    }
}

// Function to update the weather card with fetched data
function updateWeatherCard(data) {
    const cityName = document.getElementById('cityName');
    const dateTime = document.getElementById('dateTime');
    const weatherCondition = document.getElementById('weatherCondition');
    const temperature = document.getElementById('temperature');
    const minMaxTemp = document.getElementById('minMaxTemp');
    const feelsLike = document.getElementById('feelsLike');
    const humidity = document.getElementById('humidity');
    const windSpeed = document.getElementById('windSpeed');
    const pressure = document.getElementById('pressure');
    const weatherIcon = document.getElementById('weatherIcon');

    cityName.textContent = `${data.name}, ${getCountryName(data.sys.country)}`;
    dateTime.textContent = getLocalTime(data.timezone);
    weatherCondition.textContent = data.weather[0].main;
    temperature.textContent = `${Math.round(data.main.temp)}°`;
    minMaxTemp.textContent = `Min: ${Math.round(data.main.temp_min)}° | Max: ${Math.round(data.main.temp_max)}°`;
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°`;
    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = `${data.wind.speed} m/s`;
    pressure.textContent = `${data.main.pressure} hPa`;

    // Update icon based on weather condition
    weatherIcon.style.backgroundColor = getWeatherIconColor(data.main.temp);
}

// Get the background color for the weather icon based on temperature
function getWeatherIconColor(temp) {
    if (temp < 10) return '#1E90FF'; // Cold - blue
    else if (temp < 20) return '#FFD700'; // Mild - yellow
    else return '#FF6347'; // Hot - red
}

// Convert country code to country name
function getCountryName(code) {
    const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
    return regionNames.of(code);
}

// Convert UTC timestamp to local time
function getLocalTime(timezone) {
    const now = new Date();
    const localTime = new Date(now.getTime() + timezone * 1000);
    return localTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Event listener for search button
document.getElementById('btnSearch').addEventListener('click', () => {
    const city = document.getElementById('cityInput').value;
    fetchWeather(city);
});
// Function to fetch weather data by latitude and longitude
async function getWeatherByLocation(latitude, longitude) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (response.ok) {
            updateWeatherCard(data);
        } else {
            showError('Unable to fetch weather data for your location.');
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        showError('An error occurred while fetching weather data.');
    }
}

// Error message handler
function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
}

// Function to get user's location and fetch weather data
function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                getWeatherByLocation(latitude, longitude);  // Fetch weather for current location
            },
            (error) => {
                console.error('Error getting location:', error);
                if (error.code === error.PERMISSION_DENIED) {
                    showError('Permission to access location was denied. Please enable location services.');
                } else {
                    showError('Unable to retrieve your location. Please try again later.');
                }
            }
        );
    } else {
        showError('Geolocation is not supported by your browser.');
    }
}

// Call this function on page load to auto-fetch location-based weather
window.onload = getCurrentLocation;

