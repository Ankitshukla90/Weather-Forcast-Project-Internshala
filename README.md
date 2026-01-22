YoYo Weather App

YoYo Weather App is a modern, responsive weather forecasting application that provides real-time atmospheric data and 5-day extended forecasts. Built with Vanilla JavaScript and Tailwind CSS, the application features dynamic theming, intelligent search history, and geolocation integration.

Key Features

Real-Time Data: Instant access to temperature, humidity, and wind speed.
5-Day Extended Forecast: Visually organized cards showing daily weather trends with relevant iconography.
Smart Search History: A persistent dropdown menu saves your recently searched cities using LocalStorage for quick access.

Geolocation Integration: One-click weather retrieval based on the user's current physical coordinates.
Dynamic Environmental Theming: The interface background and mood shift automatically based on weather conditions (e.g., Rain, Clear, Clouds).

Temperature Unit Toggle: Switch between Celsius (°C) and Fahrenheit (°F) for current conditions.

Extreme Weather Alerts: Built-in safety logic that triggers visual warnings for temperatures exceeding 40°C.

Graceful Error Handling: Custom UI-based error notifications for invalid city names or network issues, replacing standard browser alerts.



Technical Implementation

Design & Responsiveness
The UI was built using Tailwind CSS to ensure a mobile-first, responsive experience:
Desktop: Multi-column layout with glassmorphic cards.
iPad Mini: Optimized grid spacing for medium-sized touch displays.
iPhone SE: Stacked layouts with expanded touch targets for mobile usability.

State Management
LocalStorage: Used to persist search history across browser sessions.
Dynamic Background Logic: JS functions monitor condition codes from the API to inject specific CSS classes for environmental transitions.

Project Structure

├── index.html    # Application structure and Tailwind integration
├── style.css     # advanced CSS-based weather effects
├── script.js     # API integration, DOM manipulation, and state
└── README.md     # Documentation and setup guide


Setup Instructions

Clone the Repository: https://github.com/Ankitshukla90/Weather-Forcast-Project-Internshala.git
code
Bash
git clone 


API Configuration:
Sign up for a free key at WeatherAPI.com.
Open script.js.
Replace the API_KEY constant with your unique key:
code
JavaScript
const API_KEY = 'your_api_key_here';