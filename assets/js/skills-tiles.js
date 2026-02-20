/**
 * Skills tiles – Lật tại chỗ (xoay 180°) để hiện logo
 */
(function () {
  "use strict";

  const tiles = document.querySelectorAll(".skills__tile");

  tiles.forEach((tile) => {
    tile.addEventListener("click", (e) => {
      if ("ontouchstart" in window) {
        e.preventDefault();
        tile.classList.toggle("is-flipped");
      }
    });
  });
})();
