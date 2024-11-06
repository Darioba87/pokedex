import "../leaflet/leaflet.js";
import { loadJson, el, create } from "./lib.js";

let map;
const center = [0, 0];
let pokemonColors = {};
let pokemonMarkers = {};

function showMap() {
  map = L.map("map").setView(center, 2);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
}

async function fetchInfo() {
  const data = await loadJson("data/pokemon_geojson_data.geojson");
  getList(data);
  getResults(data);
}

async function getColors() {
  pokemonColors = await loadJson("data/pokemon_types_with_colors.json");
}

function getList(data) {
  const searchInput = el("#search");
  const suggestionsBox = el("#suggestions");

  // if the user clicks outside the input
  document.addEventListener("click", (e) => {
    if (!suggestionsBox.contains(e.target) && e.target !== searchInput) {
      suggestionsBox.classList.add("is-hidden");
    }
  });
  // Suggestion input event

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    suggestionsBox.innerHTML = "";

    if (query) {
      const filter = data.features.filter((pokemon) =>
        pokemon.properties.name.toLowerCase().includes(query)
      );

      // Show Event
      if (filter.length) {
        filter.forEach((pokemon) => {
          const suggestion = create("div");
          suggestion.className = "suggestion-item";
          suggestion.textContent = `${pokemon.properties.name} - ${pokemon.properties.city}`;

          suggestion.addEventListener("click", () => {
            searchInput.value = pokemon.properties.name;
            suggestionsBox.classList.add("is-hidden");

            // connect results with the map

            const marker =
              pokemonMarkers[pokemon.properties.name.toLowerCase()];

            if (marker) {
              map.setView(marker.getLatLng(), 8);
              marker.openPopup();
            }
          });

          suggestionsBox.appendChild(suggestion);
        });
        suggestionsBox.classList.remove("is-hidden");
      } else {
        suggestionsBox.classList.add("is-hidden");
      }
    } else {
      suggestionsBox.classList.add("is-hidden");
      map.setView(center, 2);
      map.closePopup();
    }
  });
}

function getResults(data) {
  L.geoJSON(data, {
    onEachFeature: function (feature, layer) {
      const type = feature.properties.terrain.toLowerCase();
      const color = pokemonColors[type] || "rgba(0, 0, 0, 0.8)";
      console.log(pokemonColors[type]);

      layer.bindPopup(`
       <div class="content box" style="background-color:${color};">
          <h3>${feature.properties.name}</h3>
          <p class="title is-6">City: <br/>${feature.properties.city}</p>
          <p class="title is-6">Evolutions: <br/>${
            feature.properties.evolutions.length > 0
              ? feature.properties.evolutions.join(", ")
              : "there is no known evolution"
          }</p>
          <img src="${feature.properties.image_url}" alt="${
        feature.properties.name
      }" style="width: 100px;">
       </div>
        `);
      pokemonMarkers[feature.properties.name.toLowerCase()] = layer;
    },
  }).addTo(map);
}

async function init() {
  await getColors();
  showMap();
  await fetchInfo();
}

init();
