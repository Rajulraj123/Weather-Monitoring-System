export const CITIES = [
    { name: "Delhi", id: 1273294 },
    { name: "Mumbai", id: 1275339 },
    { name: "Chennai", id: 1264527 },
    { name: "Bangalore", id: 1277333 },
    { name: "Kolkata", id: 1275004 },
    { name: "Hyderabad", id: 1269843 }
  ] as const;
  
  export const REFRESH_INTERVAL = Number(process.env.NEXT_PUBLIC_UPDATE_INTERVAL) || 300000;
  
  export const WEATHER_CONDITIONS = {
    Clear: '☀️',
    Clouds: '☁️',
    Rain: '🌧️',
    Drizzle: '🌦️',
    Thunderstorm: '⛈️',
    Snow: '🌨️',
    Mist: '🌫️',
    Haze: '🌫️',
  } as const;