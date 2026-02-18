// src/App.jsx
// This is the main screen of our application.
//
// What the app does:
// 1) User enters a city name
// 2) We search possible locations (geocoding API)
// 3) User selects the correct location
// 4) We fetch current weather for that location (forecast API)
// 5) Show weather on screen

import { useState } from "react";
import { getCurrentWeather, searchLocations } from "./api/openMeteo";
import WeatherCard from "./components/WeatherCard";

export default function App() {
  // ----------- STATE VARIABLES -----------
  // State is just "data that can change" and React will re-render UI when it changes.

  const [query, setQuery] = useState("Chennai"); // input box text
  const [status, setStatus] = useState("");      // friendly messages like "Fetching..."
  const [error, setError] = useState("");        // error message text
  const [locations, setLocations] = useState([]);// list of matching locations
  const [selected, setSelected] = useState(null);// selected location object
  const [weather, setWeather] = useState(null);  // weather API response
  const [loading, setLoading] = useState(false); // disables button while fetching

  /**
   * onSearch()
   * ----------
   * Called when user clicks Search button or presses Enter.
   * It finds matching locations for the given city name.
   */
  async function onSearch() {
    // Reset old messages/data
    setError("");
    setStatus("");
    setWeather(null);
    setSelected(null);

    // Remove extra spaces
    const q = query.trim();

    // If user typed nothing
    if (!q) {
      setError("Please enter a city name.");
      return;
    }

    try {
      setLoading(true);                 // show loading state
      setStatus("Searching locations...");

      // Call API to get possible locations
      const results = await searchLocations(q);

      // Save results in state so UI can display them
      setLocations(results);

      // If no results
      if (results.length === 0) {
        setStatus("");
        setError("No matching locations found.");
      } else {
        setStatus("Select a location below.");
      }
    } catch (e) {
      // Any network/API error comes here
      setError("Failed to search locations. Check internet and try again.");
    } finally {
      // Always stop loading, even if success or fail
      setLoading(false);
    }
  }

  /**
   * onPickLocation(loc)
   * -------------------
   * Called when user clicks one location from the list.
   * Then we fetch current weather for that exact lat/lon.
   */
  async function onPickLocation(loc) {
    setError("");
    setStatus("");
    setSelected(loc);  // store which location user selected
    setWeather(null);  // clear old weather

    try {
      setLoading(true);
      setStatus("Fetching current weather...");

      // Call weather API
      const data = await getCurrentWeather(loc.latitude, loc.longitude);

      // Save to state so WeatherCard can display
      setWeather(data);

      setStatus("Done ");
    } catch (e) {
      setError("Failed to fetch weather for this location.");
    } finally {
      setLoading(false);
    }
  }

  // Make a nice label like: "Chennai, Tamil Nadu, India"
  const placeLabel = selected
    ? `${selected.name}${selected.admin1 ? ", " + selected.admin1 : ""}, ${selected.country}`
    : "";

  // ----------- UI STARTS HERE -----------
  return (
    <div className="min-h-screen bg-slate-100">
      {/* Center content and give max width */}
      <div className="mx-auto max-w-2xl p-6">

        {/* HEADER / SEARCH BOX */}
        <header className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
          <h1 className="text-2xl font-extrabold text-slate-900">
            React + Tailwind Weather App
          </h1>

          <p className="mt-2 text-slate-600">
            Type a city → choose location → view current weather (Open-Meteo, no API key).
          </p>

          {/* INPUT + BUTTON ROW */}
          <div className="mt-5 flex gap-2">
            <input
              className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2 outline-none focus:ring-2 focus:ring-slate-400"
              placeholder="Example: Vijayawada"
              value={query}
              // When user types, update query
              onChange={(e) => setQuery(e.target.value)}
              // If Enter pressed, do search
              onKeyDown={(e) => e.key === "Enter" && onSearch()}
            />

            <button
              onClick={onSearch}
              className="rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-800 active:scale-[0.99] transition"
              disabled={loading}
            >
              {loading ? "..." : "Search"}
            </button>
          </div>

          {/* Status / Error messages */}
          {(status || error) && (
            <div className="mt-3 text-sm">
              {status && <p className="text-slate-600">{status}</p>}
              {error && <p className="text-red-600 font-semibold">{error}</p>}
            </div>
          )}
        </header>

        {/* LOCATIONS LIST (shown after search) */}
        {locations.length > 0 && (
          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="font-semibold text-slate-900">Select a location</p>

            <div className="mt-3 grid gap-2">
              {locations.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => onPickLocation(loc)}
                  className="text-left rounded-xl border border-slate-200 p-3 hover:bg-slate-50 transition"
                  disabled={loading}
                >
                  <p className="font-semibold text-slate-900">
                    {loc.name}
                    {loc.admin1 ? `, ${loc.admin1}` : ""} — {loc.country}
                  </p>

                  <p className="text-xs text-slate-500">
                    Lat: {loc.latitude}, Lon: {loc.longitude}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* WEATHER DISPLAY */}
        {weather && <WeatherCard placeLabel={placeLabel} weather={weather} />}

        {/* FOOTER */}
        <footer className="mt-8 text-center text-xs text-slate-500">
          Built with Vite + React, Tailwind, and Open-Meteo.
        </footer>
      </div>
    </div>
  );
}

