import './style.css'
import type { CombinedWeatherData } from './types/weather'
import { searchWeather } from './services/openMeteo'

const app = document.querySelector<HTMLDivElement>('#app')

if (!app) {
  throw new Error('App container not found')
}

app.innerHTML = `
  <main class="weather-app">
    <section class="weather-panel">
      <header class="weather-header">
        <div>
          <p class="eyebrow">Previsão do tempo</p>
          <h1>Busque uma cidade</h1>
          <p class="subtitle">Veja temperatura, umidade, vento e muito mais em um só lugar.</p>
        </div>
      </header>

      <form id="search-form" class="search-form">
        <label class="sr-only" for="city-input">Nome da cidade</label>
        <input id="city-input" name="city" type="text" placeholder="Ex.: São Paulo" autocomplete="off" />
        <button id="search-button" type="submit">Buscar</button>
      </form>

      <p id="search-status" class="search-status" role="status">Digite uma cidade para iniciar a busca.</p>

      <section id="weather-card" class="weather-card" aria-live="polite">
        <div class="weather-empty">
          <h2>Comece sua pesquisa</h2>
          <p>Informe o nome de uma cidade para visualizar as condições atuais.</p>
        </div>
      </section>
    </section>
  </main>
`

const searchForm = document.querySelector<HTMLFormElement>('#search-form')
const searchInput = document.querySelector<HTMLInputElement>('#city-input')
const searchButton = document.querySelector<HTMLButtonElement>('#search-button')
const searchStatus = document.querySelector<HTMLParagraphElement>('#search-status')
const weatherCard = document.querySelector<HTMLElement>('#weather-card')

if (!searchForm || !searchInput || !searchButton || !searchStatus || !weatherCard) {
  throw new Error('Required weather UI elements not found')
}

const weatherCardElement = weatherCard
const searchButtonElement = searchButton
const searchStatusElement = searchStatus
let activeRequestId = 0

function renderEmptyState(message: string): void {
  weatherCardElement.innerHTML = `
    <div class="weather-empty">
      <h2>Comece sua pesquisa</h2>
      <p>${message}</p>
    </div>
  `
}

function renderLoadingState(): void {
  weatherCardElement.innerHTML = `
    <div class="weather-loading" aria-busy="true">
      <div class="spinner"></div>
      <p>Buscando clima...</p>
    </div>
  `
  searchButtonElement.disabled = true
  searchButtonElement.textContent = 'Buscando...'
  searchStatusElement.textContent = 'Buscando informações para você...'
}

function renderWeatherState(data: CombinedWeatherData): void {
  const cityLabel = `${data.city.name}, ${data.city.country_code.toUpperCase()}`
  const dayIcon = data.current.is_day === 1 ? '☀️' : '🌙'
  const dayLabel = data.current.is_day === 1 ? 'Dia' : 'Noite'
  const windDisplay = `${data.current.wind_speed_10m.toFixed(1)} km/h · ${data.current.wind_direction_10m.toFixed(0)}° (${data.windDirection})`
  const formattedDate = new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: data.city.timezone,
  }).format(new Date())

  weatherCardElement.innerHTML = `
    <div class="weather-result">
      <aside class="sidebar">
        <div>
          <p class="eyebrow">Agora</p>
          <h2>${cityLabel}</h2>
          <p class="weather-date">${formattedDate}</p>
        </div>
        <div class="temperature-block">
          <span class="temperature">${data.current.temperature_2m.toFixed(0)}°</span>
          <p>${data.weatherDescription}</p>
        </div>
        <div class="badge-row">
          <span class="pill">${dayIcon} ${dayLabel}</span>
          <span class="pill">${data.windDirection}</span>
        </div>
      </aside>

      <div class="main-content">
        <div class="metric-grid">
          <article class="metric-card">
            <span class="metric-label">Umidade</span>
            <strong>${data.current.relative_humidity_2m}%</strong>
          </article>
          <article class="metric-card">
            <span class="metric-label">Sensação térmica</span>
            <strong>${data.current.apparent_temperature.toFixed(0)}°</strong>
          </article>
          <article class="metric-card">
            <span class="metric-label">Precipitação</span>
            <strong>${data.current.precipitation_probability}%</strong>
          </article>
          <article class="metric-card">
            <span class="metric-label">Vento</span>
            <strong>${windDisplay}</strong>
          </article>
        </div>
      </div>
    </div>
  `
  searchStatusElement.textContent = `Exibindo condições atuais para ${cityLabel}.`
}

function resetButton(): void {
  searchButtonElement.disabled = false
  searchButtonElement.textContent = 'Buscar'
}

searchForm.addEventListener('submit', async (event) => {
  event.preventDefault()

  const trimmedCityName = searchInput.value.trim()
  if (!trimmedCityName) {
    activeRequestId += 1
    renderEmptyState('Digite um nome válido para iniciar a busca.')
    searchStatusElement.textContent = 'Digite uma cidade para iniciar a busca.'
    resetButton()
    return
  }

  renderLoadingState()
  const requestId = ++activeRequestId

  try {
    const result = await searchWeather(trimmedCityName)

    if (requestId !== activeRequestId) {
      return
    }

    if (!result) {
      renderEmptyState('Não encontramos essa cidade. Tente outro nome.')
      searchStatusElement.textContent = 'Nenhuma cidade encontrada. Tente outra busca.'
      return
    }

    renderWeatherState(result)
  } catch {
    if (requestId !== activeRequestId) {
      return
    }

    renderEmptyState('Não foi possível carregar as informações do clima neste momento.')
    searchStatusElement.textContent = 'Não foi possível carregar as informações do clima.'
  } finally {
    if (requestId === activeRequestId) {
      resetButton()
    }
  }
})

renderEmptyState('Digite uma cidade para iniciar a busca.')
