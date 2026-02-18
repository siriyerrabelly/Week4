// src/api/openMeteo.js
// This file contains all logic to talk to Open-Meteo APIs.
//
// We do TWO steps:
// 1) Convert city name -> latitude & longitude (Geocoding API)
// 2) Use lat/lon -> fetch weather (Forecast API)

const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

/**
 * searchLocations(name)
 * ---------------------
 * User types: "Chennai"
 * We send it to Open-Meteo Geocoding API.
 * It returns possible matching places + their latitude/longitude.
 */
export async function searchLocations(name) {
  // Build a URL like:
  // https://geocoding-api.open-meteo.com/v1/search?name=Chennai&count=5&language=en&format=json
  const url =
    `${GEO_URL}?name=${encodeURIComponent(name)}` +
    `&count=5&language=en&format=json`;

  // Call the API
  const res = await fetch(url);

  // If server says "not ok", throw an error (so our UI can show a message)
  if (!res.ok) throw new Error("Geocoding failed");

  // Convert JSON string -> JS object
  const data = await res.json();

  // data.results may be undefined if no matches
  const results = data.results || [];

  // Convert results into a clean format used by our UI
  return results.map((r) => ({
    // id helps React uniquely identify each item in list
    id: `${r.latitude},${r.longitude},${r.name},${r.country}`,
    name: r.name,
    country: r.country,
    admin1: r.admin1 || "", // state/region, sometimes missing
    latitude: r.latitude,
    longitude: r.longitude,
    timezone: r.timezone || "",
  }));
}

/**
 * getCurrentWeather(lat, lon)
 * ---------------------------
 * After user selects a place, we call the forecast API to get CURRENT weather.
 */
export async function getCurrentWeather(lat, lon) {
  // We tell Open-Meteo: "Give me these current weather fields"
  const currentVars = [
    "temperature_2m",
    "relative_humidity_2m",
    "apparent_temperature",
    "weather_code",
    "wind_speed_10m",
    "is_day",
  ].join(",");

  // Build URL like:
  // https://api.open-meteo.com/v1/forecast?latitude=..&longitude=..&current=temperature_2m,...
  const url =
    `${FORECAST_URL}?latitude=${lat}&longitude=${lon}` +
    `&current=${currentVars}` +
    `&temperature_unit=celsius&wind_speed_unit=kmh` +
    `&timezone=auto`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Weather fetch failed");

  const data = await res.json();
  return data;
}

/**
 * weatherCodeToText(code)
 * -----------------------
 * Open-Meteo gives "weather_code" as a number.
 * Example: 0 = Clear sky, 3 = Overcast, etc.
 * We convert it to human-friendly text.
 */
export function weatherCodeToText(code) {
  const map = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snowfall",
    73: "Moderate snowfall",
    75: "Heavy snowfall",
    80: "Rain showers (slight)",
    81: "Rain showers (moderate)",
    82: "Rain showers (violent)",
    95: "Thunderstorm",
  };

  // If not found, show the code itself
  return map[code] ?? `Weather code: ${code}`;
}
