/**
 * Danh thiếp – Thomas Hanson style
 * Hover: nâng lên | Click: lật phẳng (xem mặt)
 */
(function () {
  "use strict";

  const trigger = document.getElementById("visit-card-trigger");
  const modal = document.getElementById("visit-card-modal");
  const overlay = modal?.querySelector(".visit-card-modal__overlay");
  const closeBtn = modal?.querySelector(".visit-card-modal__close");
  const card = document.getElementById("visit-card-3d");

  if (!trigger || !modal || !card) return;

  function openVisitCard() {
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    card.classList.remove("is-flat");
  }

  function closeVisitCard() {
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    card.classList.remove("is-flat");
  }

  let isAnimating = false;
  function toggleFlatCard() {
    if (isAnimating) return;
    isAnimating = true;
    card.classList.toggle("is-flat");
    window.setTimeout(() => {
      isAnimating = false;
    }, 400);
  }

  trigger.addEventListener("click", openVisitCard);
  closeBtn?.addEventListener("click", closeVisitCard);
  overlay?.addEventListener("click", closeVisitCard);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.getAttribute("aria-hidden") === "false") {
      closeVisitCard();
    }
  });

  card.addEventListener("click", (e) => {
    e.stopPropagation();
    if (e.target.closest("a")) return;
    toggleFlatCard();
  });

  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleFlatCard();
    }
  });
})();
