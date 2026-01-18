function updateTechClock() {
  const timeEl = document.getElementById("techTime");
  const dateEl = document.getElementById("techDate");
  const now = new Date();

  const h = String(now.getHours()).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");
  const s = String(now.getSeconds()).padStart(2, "0");

  timeEl.textContent = `${h}:${m}:${s}`;

  const d = String(now.getDate()).padStart(2, "0");
  const mo = String(now.getMonth() + 1).padStart(2, "0");
  const y = now.getFullYear();

  dateEl.textContent = `${d}.${mo}.${y}`;
}

setInterval(updateTechClock, 1000);
updateTechClock();
