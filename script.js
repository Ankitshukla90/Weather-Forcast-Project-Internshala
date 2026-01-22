
const API_KEY = '6b57b35227124c73862151039262201'; 

// DOM Elements
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const locationBtn = document.getElementById('current-location-btn');
const recentDropdown = document.getElementById('recent-dropdown');
const weatherDisplay = document.getElementById('weather-display');
const initialMsg = document.getElementById('initial-msg');
const errorMsg = document.getElementById('error-msg');
const tempAlert = document.getElementById('temp-alert');
const unitToggle = document.getElementById('unit-toggle');
const forecastContainer = document.getElementById('forecast-container');

let currentData = null; // Stores the full response
let isCelsius = true;
let recentCities = JSON.parse(localStorage.getItem('weatherRecent')) || [];

// INITIALIZE
updateDropdownUI();

// EVENTS
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) fetchWeather(city);
    else showCustomError("Please enter a city name.");
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchBtn.click();
});

locationBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (pos) => fetchWeather(`${pos.coords.latitude},${pos.coords.longitude}`),
            () => showCustomError("Location access denied.")
        );
    }
});

unitToggle.addEventListener('click', () => {
    isCelsius = !isCelsius;
    updateTempUI();
});

// CORE FETCH FUNCTION
async function fetchWeather(query) {
    try {
        // WeatherAPI 'forecast.json' returns both current and future data
        const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${query}&days=6&aqi=no&alerts=no`;
        
        const res = await fetch(url);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error.message);

        currentData = data; // Save globally for unit toggling
        displayWeather(data);
        saveRecent(data.location.name);
        
    } catch (err) {
        showCustomError(err.message);
    }
}

function displayWeather(data) {
    errorMsg.classList.add('hidden');
    initialMsg.classList.add('hidden');
    weatherDisplay.classList.remove('hidden');

    // Location info
    document.getElementById('city-name').textContent = `${data.location.name}, ${data.location.country}`;
    document.getElementById('current-date').textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short' });
    
    // Condition info
    document.getElementById('weather-desc').textContent = data.current.condition.text;
    document.getElementById('humidity').textContent = `${data.current.humidity}%`;
    document.getElementById('wind-speed').textContent = `${data.current.wind_kph} kph`;
    
    // WeatherAPI icons don't include "https:", so we add it
    const iconUrl = data.current.condition.icon.startsWith('http') 
                    ? data.current.condition.icon 
                    : `https:${data.current.condition.icon}`;
    document.getElementById('weather-icon').src = iconUrl;

    updateTempUI();
    updateVisuals(data.current.condition.text, data.current.temp_c);
    renderForecast(data.forecast.forecastday);
}

function updateTempUI() {
    if (!currentData) return;
    
    const temp = isCelsius ? currentData.current.temp_c : currentData.current.temp_f;
    document.getElementById('temp-display').textContent = Math.round(temp);
    unitToggle.textContent = isCelsius ? "°C" : "°F";
}

function renderForecast(forecastDays) {
    forecastContainer.innerHTML = '';
    
    // WeatherAPI returns today as the first day, so we skip index 0 to get the "future" 5 days
    const futureDays = forecastDays.slice(1); 

    futureDays.forEach(day => {
        const dateName = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });
        const card = document.createElement('div');
        card.className = "bg-white/5 border border-white/10 p-5 rounded-3xl text-center hover:bg-white/10 transition-all";
        
        // Use Celsius for forecast as per standard requirements
        card.innerHTML = `
            <p class="text-xs font-black uppercase text-blue-300 mb-2">${dateName}</p>
            <img src="https:${day.day.condition.icon}" class="mx-auto w-12 h-12" />
            <p class="text-2xl font-bold mb-3">${Math.round(day.day.avgtemp_c)}°</p>
            <div class="text-[10px] space-y-1 text-slate-400 font-bold uppercase">
                <p><i class="fas fa-wind mr-1"></i> ${day.day.maxwind_kph}kph</p>
                <p><i class="fas fa-droplet mr-1"></i> ${day.day.avghumidity}%</p>
            </div>
        `;
        forecastContainer.appendChild(card);
    });
}

function updateVisuals(condition, temp) {
    const body = document.getElementById('body-bg');
    body.className = "text-white min-h-screen transition-all duration-700 ";
    
    // Extreme Temp Alert (Requirement: > 40 degrees)
    tempAlert.classList.toggle('hidden', temp < 40);

    // Dynamic Backgrounds based on condition text
    const desc = condition.toLowerCase();
    if (desc.includes('rain') || desc.includes('drizzle')) {
        body.classList.add('bg-rainy'); // Uses the CSS we wrote earlier
    } else if (desc.includes('sunny') || desc.includes('clear')) {
        body.classList.add('bg-gradient-to-br', 'from-blue-500', 'to-cyan-400');
    } else if (desc.includes('cloud') || desc.includes('overcast')) {
        body.classList.add('bg-gradient-to-br', 'from-slate-700', 'to-slate-500');
    } else {
        body.classList.add('bg-slate-900');
    }
}

// LOCAL STORAGE & DROPDOWN LOGIC
function saveRecent(city) {
    if (!recentCities.includes(city)) {
        recentCities.unshift(city);
        recentCities = recentCities.slice(0, 5);
        localStorage.setItem('weatherRecent', JSON.stringify(recentCities));
        updateDropdownUI();
    }
}

function updateDropdownUI() {
    if (recentCities.length === 0) {
        recentDropdown.classList.add('hidden');
        return;
    }
    recentDropdown.innerHTML = `<p class="px-4 py-2 text-xs font-bold text-slate-500 uppercase bg-slate-900/50">Recent Searches</p>`;
    recentCities.forEach(city => {
        const item = document.createElement('div');
        item.className = "px-4 py-3 hover:bg-blue-600 cursor-pointer transition-colors border-t border-slate-700/50";
        item.textContent = city;
        item.onclick = () => {
            cityInput.value = city;
            fetchWeather(city);
            recentDropdown.classList.add('hidden');
        };
        recentDropdown.appendChild(item);
    });

    cityInput.onfocus = () => {
        if(recentCities.length > 0) recentDropdown.classList.remove('hidden');
    };
    
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#city-input') && !e.target.closest('#recent-dropdown')) {
            recentDropdown.classList.add('hidden');
        }
    });
}

function showCustomError(msg) {
    errorMsg.textContent = msg;
    errorMsg.classList.remove('hidden');
    setTimeout(() => errorMsg.classList.add('hidden'), 5000);
}
