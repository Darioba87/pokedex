import { el, group, create } from "./lib.js";
import { db } from "./db.js";

export function getRespNavbar() {
  const $navbarBurgers = Array.prototype.slice.call(group(".navbar-burger"), 0);

  $navbarBurgers.forEach((el) => {
    el.addEventListener("click", () => {
      const target = el.dataset.target;
      const $target = document.getElementById(target);

      el.classList.toggle("is-active");
      $target.classList.toggle("is-active");
    });
  });
}

export async function getListButton() {
  const keys = await db.readKeys();
  const buttonContainer = el("#list-button");

  const existingButton = el("#like-page");

  if (keys.length > 0) {
    if (!existingButton) {
      const button = create("a");
      button.className = "button is-link";
      button.id = "like-page";
      button.href = "./bookmarks.html";
      button.innerHTML = "My List";
      buttonContainer.append(button);
    }
  } else {
    if (existingButton) {
      existingButton.remove();
    }
  }
}
