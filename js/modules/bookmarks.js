import { db } from "./db.js";
import { el } from "./lib.js";
import { getListButton, getRespNavbar } from "./menu.js";

async function checkIdb() {
  const data = await db.readKeys();
  let modal;
  if (data.length !== 0) {
    getPokemonsOnDb();
    getRespNavbar();
    getListButton();
  } else {
    modal = `
  <div class="modal is-active">
    <div class="modal-background"></div>
      <div class="modal-content">
      <div class="box">
      <img src="../../assets/empty-removebg-preview.webp" alt="empty box"/>
        <p>Unfortunately, you haven't saved anything to your favorites page yet. 
        Save something Pokémon-related that you like and 
        come back to see your collection.</p>
        <br/>
        <span>You will be redirected to the main page shortly.</span>
      </div>
    </div>
  </div>
    `;
    document.body.insertAdjacentHTML("beforeend", modal);
    setTimeout(() => {
      window.location.href = "index.html";
    }, 6000);
  }
}

async function getPokemonsOnDb() {
  const data = await db.readValues();

  const pokegrid = el("#poke-grid");
  pokegrid.innerHTML = "";
  el("#loader").classList.remove("is-hidden");

  let content = "";
  data.forEach((pokemon) => {
    content += `
      <div class="cell float-box" id="pokemon-${pokemon.id}">
        <div class="box is-unselectable grid is-justify-items-center is-poke-background is-relative">
          <div id="poke-card-${pokemon.id}" class="overlay z-0" style="background-color: ${pokemon.bgColor};"></div>
          <div id="like-${pokemon.id}" class="like like-box is-clickable" data-liked="true">
            <span class="icon">
              <svg
                class="like-icon liked"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"
                />
              </svg>
            </span>
          </div>
          <figure class="image is-128x128 is-unselectable">
            <img src="${pokemon.imageUrl}" />
          </figure>
          <div class="content">
            <p class="is-size-5 has-text-centered is-capitalized is-relative z-0 ">
              <strong class="is-family-secondary">${pokemon.name}</strong>
            </p>
            <div class="buttons">
              <a onclick="viewDetails(${pokemon.id})" class="button is-primary">
                <strong> Mehr Info </strong>
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  pokegrid.innerHTML = content;
  el("#loader").classList.add("is-hidden");

  data.forEach((pokemon) => {
    getNotLike(pokemon.id);
  });
}

async function getNotLike(pokemonId) {
  const pokeLiked = el(`#like-${pokemonId}`);

  pokeLiked.addEventListener("click", async function () {
    const pokemonElement = el(`#pokemon-${pokemonId}`);
    if (pokemonElement) {
      pokemonElement.remove();
      `Removed from DOM: #pokemon-${pokemonId}`;
    } else {
      console.error(`Element #pokemon-${pokemonId} not found in DOM`);
    }

    db.deleteItem(pokemonId);
    `Removed from IndexedDB: Pokémon ID ${pokemonId}`;

    const remainingItems = await db.readKeys();
    if (remainingItems.length === 0) {
      const likePageButton = el("#like-page");
      if (likePageButton) {
        likePageButton.remove();
      }
      setTimeout(() => {
        window.location.href = "index.html";
      }, 500);
    }
  });
}

function viewDetails(pokemonId) {
  window.location.href = `single.html?id=${pokemonId}`;
}

window.viewDetails = viewDetails;

checkIdb();
