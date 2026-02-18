// src/components/WeatherCard.jsx
// This component displays the weather in a nice "card" UI.

import { weatherCodeToText } from "../api/openMeteo";

export default function WeatherCard({ placeLabel, weather }) {
  // weather is the full API response object we got from Open-Meteo
  // weather.current contains current weather values
  const cur = weather?.current;

  // If cur doesn't exist, show nothing (avoid errors)
  if (!cur) return null;

  // Convert weather code number -> readable text
  const conditionText = weatherCodeToText(cur.weather_code);

  // is_day = 1 means daytime, 0 means night
  const isDay = cur.is_day === 1;

  return (
    <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* TOP ROW: place + temperature */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-lg font-bold text-slate-900">{placeLabel}</p>

          <p className="mt-1 text-sm text-slate-600">
            {conditionText} • {isDay ? "Day" : "Night"}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Timezone: {weather.timezone}
          </p>
        </div>

        <div className="text-right">
          {/* Math.round makes temperature like 31.2 -> 31 */}
          <p className="text-4xl font-extrabold text-slate-900">
            {Math.round(cur.temperature_2m)}°C
          </p>

          <p className="text-sm text-slate-600">
            Feels like {Math.round(cur.apparent_temperature)}°C
          </p>
        </div>
      </div>

      {/* BOTTOM ROW: small info boxes */}
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-slate-500">Humidity</p>
          <p className="font-semibold text-slate-900">
            {cur.relative_humidity_2m}%
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-slate-500">Wind</p>
          <p className="font-semibold text-slate-900">
            {cur.wind_speed_10m} km/h
          </p>
        </div>
      </div>
    </div>
  );
}
