(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e={0:`Céu limpo`,1:`Predominantemente limpo`,2:`Parcialmente nublado`,3:`Nublado`,45:`Neblina`,48:`Neblina com geada`,51:`Garoa leve`,53:`Garoa moderada`,55:`Garoa intensa`,56:`Garoa congelante leve`,57:`Garoa congelante intensa`,61:`Chuva leve`,63:`Chuva moderada`,65:`Chuva forte`,66:`Chuva congelante leve`,67:`Chuva congelante forte`,71:`Neve leve`,73:`Neve moderada`,75:`Neve forte`,77:`Grãos de neve`,80:`Pancadas de chuva leves`,81:`Pancadas de chuva moderadas`,82:`Pancadas de chuva violentas`,85:`Pancadas de neve leves`,86:`Pancadas de neve fortes`,95:`Tempestade`,96:`Tempestade com granizo leve`,99:`Tempestade com granizo forte`};function t(t){return typeof t!=`number`||!Number.isFinite(t)?`Condição desconhecida`:e[t]??`Condição desconhecida`}var n=[`N`,`NE`,`E`,`SE`,`S`,`SO`,`O`,`NO`];function r(e){if(typeof e!=`number`||!Number.isFinite(e))return`N`;let t=(e%360+360)%360;return n[Math.round(t/45)%n.length]??`N`}var i=`https://geocoding-api.open-meteo.com/v1/search`,a=`https://api.open-meteo.com/v1/forecast`;function o(e){return typeof e==`string`&&e.trim().length>0}function s(e){return typeof e==`number`&&Number.isFinite(e)}async function c(e){try{let t=await fetch(e);return t.ok?await t.json():null}catch{return null}}async function l(e){if(!o(e))return null;let t=e.trim();if(t.length===0)return null;let n=await c(`${i}?name=${encodeURIComponent(t)}&count=1&language=pt&format=json`);if(!n?.results?.length)return null;let[r]=n.results;return!o(r?.name)||!s(r?.latitude)||!s(r?.longitude)||!o(r?.timezone)||!o(r?.country_code)?null:r}async function u(e,t,n){if(!s(e)||!s(t)||!o(n))return null;let r=n.trim();if(r.length===0)return null;let i=await c(`${a}?latitude=${e}&longitude=${t}&current_weather=true&hourly=relativehumidity_2m,apparent_temperature,precipitation_probability,precipitation&timezone=${encodeURIComponent(r)}`);if(!i?.current_weather||!i.hourly?.time?.length)return null;let{current_weather:l,hourly:u,hourly_units:d}=i,f=l.time,p=u.time??[],m=p.indexOf(f);if(m<0){let e=f.replace(/:\d{2}$/,`:00`);m=p.indexOf(e)}if(m<0)return null;let h=u.relativehumidity_2m?.[m],g=u.apparent_temperature?.[m],_=u.precipitation_probability?.[m],v=u.precipitation?.[m];return!s(h)||!s(g)||!s(_)||!s(v)?null:{current:{temperature_2m:l.temperature,relative_humidity_2m:h,apparent_temperature:g,precipitation_probability:_,wind_speed_10m:l.windspeed,wind_direction_10m:l.winddirection,precipitation:v,is_day:l.is_day,weather_code:l.weathercode},current_units:{temperature_2m:d?.temperature_2m??`°C`,relative_humidity_2m:d?.relativehumidity_2m??`%`,apparent_temperature:d?.apparent_temperature??`°C`,precipitation_probability:d?.precipitation_probability??`%`,wind_speed_10m:`km/h`,wind_direction_10m:`°`,precipitation:d?.precipitation??`mm`,is_day:``}}}async function d(e){let n=await l(e);if(!n)return null;let i=await u(n.latitude,n.longitude,n.timezone);return!i?.current||!i.current_units?null:{city:n,current:i.current,currentUnits:i.current_units,weatherDescription:t(i.current.weather_code),windDirection:r(i.current.wind_direction_10m)}}var f=document.querySelector(`#app`);if(!f)throw Error(`App container not found`);f.innerHTML=`
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
`;var p=document.querySelector(`#search-form`),m=document.querySelector(`#city-input`),h=document.querySelector(`#search-button`),g=document.querySelector(`#search-status`),_=document.querySelector(`#weather-card`);if(!p||!m||!h||!g||!_)throw Error(`Required weather UI elements not found`);var v=_,y=h,b=g,x=0;function S(e){v.innerHTML=`
    <div class="weather-empty">
      <h2>Comece sua pesquisa</h2>
      <p>${e}</p>
    </div>
  `}function C(){v.innerHTML=`
    <div class="weather-loading" aria-busy="true">
      <div class="spinner"></div>
      <p>Buscando clima...</p>
    </div>
  `,y.disabled=!0,y.textContent=`Buscando...`,b.textContent=`Buscando informações para você...`}function w(e){let t=`${e.city.name}, ${e.city.country_code.toUpperCase()}`,n=e.current.is_day===1?`☀️`:`🌙`,r=e.current.is_day===1?`Dia`:`Noite`,i=`${e.current.wind_speed_10m.toFixed(1)} km/h · ${e.current.wind_direction_10m.toFixed(0)}° (${e.windDirection})`;v.innerHTML=`
    <div class="weather-result">
      <aside class="sidebar">
        <div>
          <p class="eyebrow">Agora</p>
          <h2>${t}</h2>
          <p class="weather-date">${new Intl.DateTimeFormat(`pt-BR`,{dateStyle:`medium`,timeStyle:`short`,timeZone:e.city.timezone}).format(new Date)}</p>
        </div>
        <div class="temperature-block">
          <span class="temperature">${e.current.temperature_2m.toFixed(0)}°</span>
          <p>${e.weatherDescription}</p>
        </div>
        <div class="badge-row">
          <span class="pill">${n} ${r}</span>
          <span class="pill">${e.windDirection}</span>
        </div>
      </aside>

      <div class="main-content">
        <div class="metric-grid">
          <article class="metric-card">
            <span class="metric-label">Umidade</span>
            <strong>${e.current.relative_humidity_2m}%</strong>
          </article>
          <article class="metric-card">
            <span class="metric-label">Sensação térmica</span>
            <strong>${e.current.apparent_temperature.toFixed(0)}°</strong>
          </article>
          <article class="metric-card">
            <span class="metric-label">Precipitação</span>
            <strong>${e.current.precipitation_probability}%</strong>
          </article>
          <article class="metric-card">
            <span class="metric-label">Vento</span>
            <strong>${i}</strong>
          </article>
        </div>
      </div>
    </div>
  `,b.textContent=`Exibindo condições atuais para ${t}.`}function T(){y.disabled=!1,y.textContent=`Buscar`}p.addEventListener(`submit`,async e=>{e.preventDefault();let t=m.value.trim();if(!t){x+=1,S(`Digite um nome válido para iniciar a busca.`),b.textContent=`Digite uma cidade para iniciar a busca.`,T();return}C();let n=++x;try{let e=await d(t);if(n!==x)return;if(!e){S(`Não encontramos essa cidade. Tente outro nome.`),b.textContent=`Nenhuma cidade encontrada. Tente outra busca.`;return}w(e)}catch{if(n!==x)return;S(`Não foi possível carregar as informações do clima neste momento.`),b.textContent=`Não foi possível carregar as informações do clima.`}finally{n===x&&T()}}),S(`Digite uma cidade para iniciar a busca.`);