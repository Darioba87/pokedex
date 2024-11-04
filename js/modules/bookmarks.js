import { db } from "./db.js";
import { el } from "./lib.js";

async function getPokemonsOnDb() {
  const data = await db.readValues();

  const pokegrid = el("#poke-grid");
  pokegrid.innerHTML = "";
  el("#loader").classList.remove("is-hidden");
  let content = "";
  data.forEach((pokemon) => {
    content += `
    <div class="cell float-box">
          <div class="box grid is-justify-items-center is-poke-background is-relative">
            <div id="poke-card-${pokemon.id}" class="overlay z-0" style="background-color: ${pokemon.bgColor};"></div>
            <div id="like-${pokemon.id}" class="like like-box is-clickable" data-liked="true"
      }">
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
            <figure class="image is-128x128">
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
}

getPokemonsOnDb();
