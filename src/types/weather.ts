export interface GeocodingResult {
  name: string;
  latitude: number;
  longitude: number;
  country_code: string;
  timezone: string;
}

export interface GeocodingApiResponse {
  results?: GeocodingResult[];
}

export interface ForecastCurrentUnits {
  temperature_2m: string;
  relative_humidity_2m: string;
  apparent_temperature: string;
  precipitation_probability: string;
  wind_speed_10m: string;
  wind_direction_10m: string;
  precipitation: string;
  is_day: string;
}

export interface ForecastCurrent {
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  precipitation_probability: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  precipitation: number;
  is_day: number;
  weather_code: number;
}

export interface ForecastApiResponse {
  current?: ForecastCurrent;
  current_units?: ForecastCurrentUnits;
}

export interface CombinedWeatherData {
  city: GeocodingResult;
  current: ForecastCurrent;
  currentUnits: ForecastCurrentUnits;
  weatherDescription: string;
  windDirection: string;
}
