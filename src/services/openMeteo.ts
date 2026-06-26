import type {
  CombinedWeatherData,
  ForecastApiResponse,
  GeocodingApiResponse,
  GeocodingResult,
} from '../types/weather'
import { mapWeatherCode } from '../utils/weatherCode'
import { getWindDirection } from '../utils/windDirection'

const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const WEATHER_BASE_URL = 'https://api.open-meteo.com/v1/forecast'

function isValidString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function isValidNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

async function safeFetchJson<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url)

    if (!response.ok) {
      return null
    }

    return (await response.json()) as T
  } catch {
    return null
  }
}

export async function searchCity(cityName: string): Promise<GeocodingResult | null> {
  if (!isValidString(cityName)) {
    return null
  }

  const trimmedCityName = cityName.trim()
  if (trimmedCityName.length === 0) {
    return null
  }

  const url = `${GEOCODING_BASE_URL}?name=${encodeURIComponent(trimmedCityName)}&count=1&language=pt&format=json`
  const data = await safeFetchJson<GeocodingApiResponse>(url)

  if (!data?.results?.length) {
    return null
  }

  const [result] = data.results
  if (
    !isValidString(result?.name) ||
    !isValidNumber(result?.latitude) ||
    !isValidNumber(result?.longitude) ||
    !isValidString(result?.timezone) ||
    !isValidString(result?.country_code)
  ) {
    return null
  }

  return result
}

interface OpenMeteoWeatherResponse {
  current_weather?: {
    temperature: number
    windspeed: number
    winddirection: number
    weathercode: number
    is_day: number
    time: string
  }
  hourly?: {
    time?: string[]
    relativehumidity_2m?: number[]
    apparent_temperature?: number[]
    precipitation_probability?: number[]
    precipitation?: number[]
  }
  hourly_units?: {
    temperature_2m?: string
    relativehumidity_2m?: string
    apparent_temperature?: string
    precipitation_probability?: string
    precipitation?: string
  }
  timezone?: string
}

export async function getWeather(
  latitude: number,
  longitude: number,
  timezone: string,
): Promise<ForecastApiResponse | null> {
  if (!isValidNumber(latitude) || !isValidNumber(longitude) || !isValidString(timezone)) {
    return null
  }

  const trimmedTimezone = timezone.trim()
  if (trimmedTimezone.length === 0) {
    return null
  }

  const url = `${WEATHER_BASE_URL}?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=relativehumidity_2m,apparent_temperature,precipitation_probability,precipitation&timezone=${encodeURIComponent(trimmedTimezone)}`
  const data = await safeFetchJson<OpenMeteoWeatherResponse>(url)

  if (!data?.current_weather || !data.hourly?.time?.length) {
    return null
  }

  const { current_weather: currentWeather, hourly, hourly_units: hourlyUnits } = data
  const currentTime = currentWeather.time
  const timeIndex = hourly.time?.indexOf(currentTime)

  if (timeIndex === undefined || timeIndex < 0) {
    return null
  }

  const humidity = hourly.relativehumidity_2m?.[timeIndex]
  const apparentTemperature = hourly.apparent_temperature?.[timeIndex]
  const precipitationProbability = hourly.precipitation_probability?.[timeIndex]
  const precipitation = hourly.precipitation?.[timeIndex]

  if (
    !isValidNumber(humidity) ||
    !isValidNumber(apparentTemperature) ||
    !isValidNumber(precipitationProbability) ||
    !isValidNumber(precipitation)
  ) {
    return null
  }

  return {
    current: {
      temperature_2m: currentWeather.temperature,
      relative_humidity_2m: humidity,
      apparent_temperature: apparentTemperature,
      precipitation_probability: precipitationProbability,
      wind_speed_10m: currentWeather.windspeed,
      wind_direction_10m: currentWeather.winddirection,
      precipitation,
      is_day: currentWeather.is_day,
      weather_code: currentWeather.weathercode,
    },
    current_units: {
      temperature_2m: hourlyUnits?.temperature_2m ?? '°C',
      relative_humidity_2m: hourlyUnits?.relativehumidity_2m ?? '%',
      apparent_temperature: hourlyUnits?.apparent_temperature ?? '°C',
      precipitation_probability: hourlyUnits?.precipitation_probability ?? '%',
      wind_speed_10m: 'km/h',
      wind_direction_10m: '°',
      precipitation: hourlyUnits?.precipitation ?? 'mm',
      is_day: '',
    },
  }
}

export async function searchWeather(cityName: string): Promise<CombinedWeatherData | null> {
  const city = await searchCity(cityName)
  if (!city) {
    return null
  }

  const weatherResponse = await getWeather(city.latitude, city.longitude, city.timezone)
  if (!weatherResponse?.current || !weatherResponse.current_units) {
    return null
  }

  return {
    city,
    current: weatherResponse.current,
    currentUnits: weatherResponse.current_units,
    weatherDescription: mapWeatherCode(weatherResponse.current.weather_code),
    windDirection: getWindDirection(weatherResponse.current.wind_direction_10m),
  }
}
