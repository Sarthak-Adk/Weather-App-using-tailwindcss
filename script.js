const apiKey = '2a57e1e4c13eb0579d5b5f223462a126'; // Replace with your OpenWeatherMap API key

// Function to fetch weather data by city name
async function fetchWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();

    if (response.ok) {
        updateWeatherCard(data);
    } else {
        alert('City not found. Please enter a valid city.');
    }
}

// Function to fetch weather data by latitude and longitude
async function getWeatherByLocation(latitude, longitude) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();

    if (response.ok) {
        updateWeatherCard(data);
    } else {
        alert('Unable to fetch weather data for your location.');
    }
}

// Function to get the country name from the country code
const getCountryName = (code) => {
    return new Intl.DisplayNames(['en'], { type: 'region' }).of(code);
}

// Function to update date and time dynamically
function getLocalTime(timezoneOffset) {
    const utcTime = new Date(); // Get current UTC time
    const localTime = new Date(utcTime.getTime() + timezoneOffset * 1000); // Convert offset to milliseconds and adjust UTC time
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    };
    
    return localTime.toLocaleDateString('en-US', options); // Format and return local time as string
}


// Function to update weather card with fetched data
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

    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };

    cityName.textContent = `${data.name}, ${getCountryName(data.sys.country)}`;
    dateTime.textContent = getLocalTime(data.timezone);
    weatherCondition.textContent = data.weather[0].main;
    temperature.textContent = `${Math.round(data.main.temp)}°`;
    minMaxTemp.textContent = `Min: ${Math.round(data.main.temp_min)}° | Max: ${Math.round(data.main.temp_max)}°`;
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°`;
    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = `${data.wind.speed} m/s`;
    pressure.textContent = `${data.main.pressure} hPa`;

    // Update weather icon color based on temperature (just an example)
    const tempCelsius = Math.round(data.main.temp);
    if (tempCelsius > 30) {
        weatherIcon.classList.add('bg-red-500');
        weatherIcon.classList.remove('bg-blue-500', 'bg-yellow-500');
    } else if (tempCelsius > 20) {
        weatherIcon.classList.add('bg-yellow-500');
        weatherIcon.classList.remove('bg-red-500', 'bg-blue-500');
    } else {
        weatherIcon.classList.add('bg-blue-500');
        weatherIcon.classList.remove('bg-red-500', 'bg-yellow-500');
    }
}

// Handle search on pressing Enter
const cityInput = document.getElementById('cityInput');
cityInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        const city = cityInput.value;
        fetchWeather(city);
    }
});

// Handle search on pressing search button
const citySearch = document.getElementById('btnSearch');
citySearch.addEventListener('click', function () {
        const city = cityInput.value;
        fetchWeather(city);
});

// Get current location and fetch weather data
function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            getWeatherByLocation(latitude, longitude);
        }, (error) => {
            console.error("Error getting location: ", error);
            alert("Unable to retrieve your location. Please enable location services.");
        });
    } else {
        alert("Geolocation is not supported by your browser.");
    }
}

// Fetch weather data based on user's current location when page loads
window.onload = getCurrentLocation;
