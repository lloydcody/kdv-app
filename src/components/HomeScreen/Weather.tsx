import React from 'react';
import { useWeather } from '../../hooks/useWeather';
import { Sun, Cloud, CloudRain } from 'lucide-react';

export function Weather() {
  const { current, forecast } = useWeather();

  if (!current) return null;

  return (
    <div className="flex items-end gap-12">
      {/* Current Weather */}
      <div>
        <div className="flex items-center gap-4">
          <Sun className="w-12 h-12 text-yellow-500" />
          <span className="text-4xl font-light">
            {current.temp}°C
          </span>
        </div>
        <p className="text-gray-600 mt-1">
          {current.condition}
        </p>
      </div>

      {/* 3-Day Forecast */}
      <div className="flex gap-8">
        {forecast.map((day) => (
          <div key={day.date} className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              {day.day}
            </p>
            {day.condition === 'Sunny' && (
              <Sun className="w-6 h-6 mx-auto text-yellow-500" />
            )}
            {day.condition === 'Cloudy' && (
              <Cloud className="w-6 h-6 mx-auto text-gray-400" />
            )}
            {day.condition === 'Rain' && (
              <CloudRain className="w-6 h-6 mx-auto text-blue-400" />
            )}
            <p className="text-sm mt-1">
              {day.temp}°C
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}