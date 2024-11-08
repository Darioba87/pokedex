import { init } from "./modules/main.js";
import { getRespNavbar, getListButton } from "./modules/menu.js";

getRespNavbar();
getListButton();

if (window.location.href.includes("index.html")) {
  init();
}
