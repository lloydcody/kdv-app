import { useState, useEffect } from 'react';

interface WeatherData {
  current: {
    temp: number;
    condition: string;
  };
  forecast: Array<{
    date: string;
    day: string;
    temp: number;
    condition: string;
  }>;
}

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Replace with your weather API endpoint
        const response = await fetch('https://api.weatherapi.com/v1/forecast.json?key=YOUR_API_KEY&q=auto:ip&days=3');
        const data = await response.json();
        
        setWeather({
          current: {
            temp: data.current.temp_c,
            condition: data.current.condition.text
          },
          forecast: data.forecast.forecastday.map((day: any) => ({
            date: day.date,
            day: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
            temp: day.day.avgtemp_c,
            condition: day.day.condition.text
          }))
        });
      } catch (error) {
        console.error('Failed to fetch weather:', error);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 30 * 60 * 1000); // Update every 30 minutes

    return () => clearInterval(interval);
  }, []);

  return weather || { current: null, forecast: [] };
}