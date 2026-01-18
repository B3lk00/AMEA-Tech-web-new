function updateClock() {
  const clock = document.getElementById("digitalClock");
  const dateEl = document.getElementById("digitalDate");
  const now = new Date();

  const h = String(now.getHours()).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");
  const s = String(now.getSeconds()).padStart(2, "0");

  clock.innerHTML = `${h}<span class="blink">:</span>${m}<span class="blink">:</span>${s}`;

  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();

  dateEl.textContent = `${day}.${month}.${year}`;
}

setInterval(updateClock, 1000);
updateClock();
