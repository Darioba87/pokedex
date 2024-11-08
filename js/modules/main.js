import { loadJson, el, create } from "./lib.js";
import { db } from "./db.js";
import { getListButton } from "./menu.js";

let currentPage = 1;
const limit = 12;
let typeColors = {};

/**
 * Generate a color pall
 */

async function loadTypesColors() {
  typeColors = await loadJson("data/pokemon_types_with_colors.json");
  if (!typeColors) {
    console.error("Fail to load type Colors");
  }
}

export async function init() {
  await loadTypesColors();
  await getPokemonList();
  await getListButton();
}

export async function getPokemonList(page = 1) {
  currentPage = page;
  const offset = (currentPage - 1) * limit;
  const url = `https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${offset}`;

  const data = await loadJson(url);
  if (!data) {
    console.error("load Error");
    return;
  }

  const pokemons = data.results.map((pokemon) => {
    const pokemonId = pokemon.url.split("/")[6];
    return {
      ...pokemon,
      id: pokemonId,
      imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemonId}.svg`,
      typeUrl: `https://pokeapi.co/api/v2/pokemon/${pokemonId}/`,
    };
  });

  generateContent(pokemons);
  createPagination();
}

async function generateContent(pokemons) {
  const pokegrid = el("#poke-grid");
  pokegrid.innerHTML = "";
  el("#loader").classList.remove("is-hidden");
  let content = "";

  for (const element of pokemons) {
    const pokemonId = element.id;

    const isStored = await isPokemonStored(pokemonId);

    let pokemonType = "normal";
    if (element.typeUrl) {
      const details = await loadJson(element.typeUrl);
      pokemonType = details.types[0].type.name;
      const typeColor = typeColors[pokemonType] || "#A8A77A";
      element["color"] = typeColor;

      content += `
        <div class="cell float-box">
          <div class="box grid is-justify-items-center is-poke-background is-relative">
            <div id="poke-card-${pokemonId}" class="overlay z-0" style="background-color: ${typeColor};"></div>
            <div id="like-${pokemonId}" class="like like-box is-clickable" data-liked="${
        isStored ? "true" : "false"
      }">
              <span class="icon">
                <svg
                  class="like-icon ${
                    isStored ? "liked" : ""
                  }" // Solo se asigna 'liked' si está en IndexedDB
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"
                  />
                </svg>
              </span>
            </div>
            <figure class="image is-128x128">
              <img src="${element.imageUrl}" />
            </figure>
            <div class="content">
              <p class="is-size-5 has-text-centered is-capitalized is-relative z-0 ">
                <strong class="is-family-secondary">${element.name}</strong>
              </p>
              <div class="buttons">
                <a onclick="viewDetails(${pokemonId})" class="button is-primary">
                  <strong> Mehr Info </strong>
                </a>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  }

  pokegrid.innerHTML = content;

  pokemons.forEach((element) => {
    const pokemonId = element.id;
    const likeElement = el(`#like-${pokemonId}`);
    if (likeElement) {
      likeElement.addEventListener("click", (event) =>
        likeButton(event, element)
      );
    }
  });

  setTimeout(() => {
    el("#loader").classList.add("is-hidden");
  }, 1000);
}

function viewDetails(pokemonId) {
  window.location.href = `single.html?id=${pokemonId}`;
}

function createPagination() {
  const pagination = el("#pagination");
  pagination.innerHTML = "";

  if (currentPage > 1) {
    const prevButton = create("button");
    prevButton.textContent = "Previous page";
    prevButton.classList.add("button");
    prevButton.addEventListener("click", () => {
      currentPage--;
      getPokemonList(currentPage);
    });

    pagination.appendChild(prevButton);
  }

  const nextButton = create("button");
  nextButton.textContent = "Next page";
  nextButton.classList.add("button");
  nextButton.addEventListener("click", () => {
    currentPage++;
    getPokemonList(currentPage);
  });

  pagination.appendChild(nextButton);
}

async function likeButton(event, pokemon) {
  const likeElement = event.currentTarget;
  const svg = likeElement.querySelector(".like-icon");
  const isLiked = likeElement.getAttribute("data-liked") === "true";
  likeElement.setAttribute("data-liked", !isLiked);

  const keys = await db.readKeys();

  svg.classList.toggle("liked");

  if (!isLiked) {
    const pokeData = {
      id: pokemon.id,
      name: pokemon.name,
      imageUrl: pokemon.imageUrl,
      bgColor: pokemon.color,
    };

    try {
      await db.writeItem(pokemon.id, pokeData);
      (`Pokemon ${pokemon.name} saved, ${pokemon.id}`);
      getListButton();
    } catch (error) {
      ("Filed to save", error);
    }
  } else {
    db.deleteItem(pokemon.id);
    (`Pokemon ${pokemon.name} removed, ${pokemon.id}`);
    getListButton();
  }
}

async function isPokemonStored(pokemonId) {
  try {
    const storedKeys = await db.readKeys();
    return storedKeys.includes(String(pokemonId));
  } catch (error) {
    console.error(`Error checking if Pokémon ${pokemonId} is stored:`, error);
    return false;
  }
}

window.viewDetails = viewDetails;
