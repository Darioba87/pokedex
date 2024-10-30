import { el, create, loadJson } from "./lib.js";

const basicPathUrl = window.location.protocol + "//" + window.location.host;

async function getSinglePokemon() {
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
  console.log(data);

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

  const featuredPokemon = {
    name: data.name,
    desciption: description,
    stats: stats,
    abilities: abilities,
    types: data.types.map((type) => type.type.name),
    imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemonId}.svg`,
  };

  displayInfo(featuredPokemon);
}

function displayInfo(pokemon) {
  el("#featuredImage").src = pokemon.imageUrl;
  el("#pokemon-name").innerText = pokemon.name;
  el("#type").innerText = pokemon.types;
  // TODO
  //Completar el HTML y agregar un spinner
}

getSinglePokemon();
