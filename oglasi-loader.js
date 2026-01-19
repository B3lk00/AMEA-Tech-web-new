async function ucitajOglaseIndex() {
  const url = `./oglasi/index.json?ts=${Date.now()}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Ne mogu ucitati oglasi/index.json");
  const data = await res.json();
  return data.items || [];
}

function renderOglasi(items, container) {
  if (!items.length) {
    container.innerHTML = `<p style="opacity:.8;">Trenutno nema oglasa u ovoj kategoriji.</p>`;
    return;
  }

  container.innerHTML = items.map(o => {
    const img = (o.slike && o.slike.length) ? `${o.slike[0]}?ts=${Date.now()}` : "";
    const spec = (o.spec || []).slice(0, 5).map(s => `<li>${s}</li>`).join("");

    return `
      <article class="ad-card">
        ${img ? `<img class="ad-img" src="${img}" alt="${o.naziv}">` : ``}
        <div class="ad-body">
          <div class="ad-top">
            <h3 class="ad-title">${o.naziv}</h3>
            <div class="ad-price">${o.cijena || ""}</div>
          </div>
          ${o.stanje ? `<div class="ad-meta"><span class="ad-badge">${o.stanje}</span></div>` : ``}
          ${o.opis ? `<p class="ad-desc">${o.opis}</p>` : ``}
          ${spec ? `<ul class="ad-spec">${spec}</ul>` : ``}
        </div>
      </article>
    `;
  }).join("");
}

async function initOglasi(kategorija) {
  const container = document.getElementById("oglasi");
  if (!container) return;

  container.innerHTML = `<p style="opacity:.8;">Učitavam oglase...</p>`;

  try {
    const items = await ucitajOglaseIndex();
    const filtrirano = items.filter(o => o.kategorija === kategorija);
    renderOglasi(filtrirano, container);
  } catch (e) {
    container.innerHTML = `<p style="color:#b00;">Greška: ${e.message}</p>`;
  }
}
