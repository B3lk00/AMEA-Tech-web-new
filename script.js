function updateFancyClock() {
  const clockEl = document.getElementById("fancyClock");
  const dateEl  = document.getElementById("fancyDate");
  const now = new Date();

  // vrijeme
  const h = String(now.getHours()).padStart(2,"0");
  const m = String(now.getMinutes()).padStart(2,"0");
  const s = String(now.getSeconds()).padStart(2,"0");
  clockEl.querySelector(".digits").textContent = `${h}:${m}:${s}`;

  // datum
  const day   = String(now.getDate()).padStart(2,"0");
  const month = String(now.getMonth()+1).padStart(2,"0");
  const year  = now.getFullYear();
  dateEl.textContent = `${day} . ${month} . ${year}`;
}

setInterval(updateFancyClock, 1000);
updateFancyClock();
