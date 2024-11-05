import { el, loadJson } from "./lib.js";
import { db } from "./db.js";

const basicPathUrl = window.location.protocol + "//" + window.location.host;
let typeColors = {};

async function loadTypesColors() {
  typeColors = await loadJson("../../data/pokemon_types_with_colors.json");
  if (!typeColors) {
    console.error("Failed to load type colors");
  }
}

async function getSinglePokemon() {
  el("#loader").classList.remove("is-hidden");
  const urlParam = new URLSearchParams(window.location.search);
  const pokemonId = urlParam.get("id");

  if (!pokemonId) {
    location.replace(basicPathUrl);
    return;
  }

  const data = await loadJson(
    `https://pokeapi.co/api/v2/pokemon/${pokemonId}/`
  );

  const speciesData = await loadJson(
    `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`
  );

  // Pokemon description on eng language
  const descriptionEntry = speciesData.flavor_text_entries.find(
    (entry) => entry.language.name === "en"
  );

  const description = descriptionEntry
    ? descriptionEntry.flavor_text
    : "Description not available.";

  // obtain statistics

  const stats = data.stats.map((stat) => ({
    statName: stat.stat.name,
    baseStat: stat.base_stat,
  }));

  // Obtain Abilities
  const abilities = data.abilities.map((ability) => ability.ability.name);

  // Obtain Color
  const primaryType = data.types[0]?.type.name || "normal;";
  const typeColor = typeColors[primaryType] || "#A8A77A";

  const featuredPokemon = {
    name: data.name,
    desciption: description,
    stats: stats,
    abilities: abilities,
    types: data.types.map((type) => type.type.name),
    imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemonId}.svg`,
    color: typeColor,
  };

  displayInfo(featuredPokemon);
  setTimeout(() => {
    el("#loader").classList.add("is-hidden");
  }, 1000);
  getPokemonOnIdb(pokemonId);
}

function displayInfo(pokemon) {
  el("#card").style.backgroundColor = pokemon.color;
  el("#featuredImage").src = pokemon.imageUrl;
  el("#pokemon-name").innerText = pokemon.name;
  el("#type").innerText = pokemon.types;

  // Pokemon Stats
  let statsContent = "";
  pokemon.stats.forEach((stat) => {
    statsContent += `
    <div class="column is-half">
      <p class="heading is-uppercase">${stat.statName}</p>
      <p class="title is-4">${stat.baseStat}</p>
    </div>
    `;
  });
  el("#stats").innerHTML = statsContent;

  // Pokemon Desciption with text fix

  el("#desciption").textContent = pokemon.desciption.replace(/[\n\f\r]/g, " ");
}

function back() {
  history.back();
}

async function init() {
  await loadTypesColors();
  getSinglePokemon();
}

async function getPokemonOnIdb(pokeId) {
  const keys = await db.readKeys();

  keys.forEach((key) => {
    if (key === pokeId) {
      el("#like-icon").classList.add("liked");
    }
  });
}

init();
el("#back").addEventListener("click", back);
