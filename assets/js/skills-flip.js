/**
 * Skills section – Mỗi chữ cái nghiêng theo chuột, mượt mà 60fps.
 */
(function () {
  "use strict";

  const section = document.getElementById("skills");
  const titleWrap = section?.querySelector(".skills__title-wrap");
  const letters = section?.querySelectorAll(".skills__title-letter");

  if (!section || !letters?.length || !titleWrap) return;

  const maxTilt = 45;
  const influenceRadius = 100;
  const targetsY = Array.from(letters, () => 0);
  const targetsX = Array.from(letters, () => 0);
  const currentY = Array.from(letters, () => 0);
  const currentX = Array.from(letters, () => 0);
  let rafId = null;
  let mouseX = 0;
  let mouseY = 0;
  let isHovering = false;

  function getClient(e) {
    const t = e.touches ? e.touches[0] : e;
    return { x: t.clientX, y: t.clientY };
  }

  function handleMove(e) {
    const p = getClient(e);
    mouseX = p.x;
    mouseY = p.y;
    letters.forEach((letter, i) => {
      const rect = letter.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (mouseX - cx) / influenceRadius;
      const dy = (mouseY - cy) / influenceRadius;
      targetsY[i] = Math.max(-1, Math.min(1, dx)) * maxTilt;
      targetsX[i] = Math.max(-1, Math.min(1, -dy)) * maxTilt;
    });
  }

  function handleEnter() {
    isHovering = true;
    loop();
  }

  function handleLeave() {
    isHovering = false;
    targetsY.fill(0);
    targetsX.fill(0);
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function loop() {
    const ease = 0.12;
    letters.forEach((letter, i) => {
      currentY[i] = lerp(currentY[i], targetsY[i], ease);
      currentX[i] = lerp(currentX[i], targetsX[i], ease);
      letter.style.transform = `rotateY(${currentY[i].toFixed(2)}deg) rotateX(${currentX[i].toFixed(2)}deg)`;
    });
    const moving = targetsY.some((t, i) => Math.abs(currentY[i] - t) > 0.02) ||
                  targetsX.some((t, i) => Math.abs(currentX[i] - t) > 0.02);
    if (isHovering || moving) {
      rafId = requestAnimationFrame(loop);
    }
  }

  titleWrap.addEventListener("mouseenter", handleEnter);
  titleWrap.addEventListener("mousemove", handleMove);
  titleWrap.addEventListener("mouseleave", handleLeave);
  titleWrap.addEventListener("touchstart", (e) => {
    isHovering = true;
    handleMove(e);
    loop();
  }, { passive: true });
  titleWrap.addEventListener("touchmove", handleMove, { passive: true });
  titleWrap.addEventListener("touchend", handleLeave);
  titleWrap.addEventListener("touchcancel", handleLeave);
})();
