async function ucitajOglase() {
  const res = await fetch("oglasi.json?v=1");
  if (!res.ok) throw new Error("Ne mogu ucitati oglasi.json");
  const data = await res.json();
  return data.items || [];
}

function renderOglasi(items, container) {
  if (!items.length) {
    container.innerHTML = `<p style="opacity:.8;">Trenutno nema oglasa u ovoj kategoriji.</p>`;
    return;
  }

  container.innerHTML = items.map(o => {
    const img = (o.slike && o.slike.length) ? o.slike[0] : "";
    const spec = (o.spec || []).slice(0, 4).map(s => `<li>${s}</li>`).join("");

    return `
      <article class="ad-card">
        ${img ? `<img class="ad-img" src="${img}" alt="${o.naziv}">` : ``}

        <div class="ad-body">
          <div class="ad-top">
            <h3 class="ad-title">${o.naziv}</h3>
            <div class="ad-price">${o.cijena || ""}</div>
          </div>

          <div class="ad-meta">
            <span class="ad-badge">${o.stanje || ""}</span>
          </div>

          <p class="ad-desc">${o.opis || ""}</p>

          ${spec ? `<ul class="ad-spec">${spec}</ul>` : ""}

          <div class="ad-contact">
            ${o.kontakt?.telefon ? `<a href="tel:${o.kontakt.telefon}">📞 ${o.kontakt.telefon}</a>` : ""}
            ${o.kontakt?.email ? `<a href="mailto:${o.kontakt.email}">✉️ ${o.kontakt.email}</a>` : ""}
          </div>
        </div>
      </article>
    `;
  }).join("");
}

async function initOglasi(kategorija) {
  const container = document.getElementById("oglasi");
  if (!container) return;

  try {
    const items = await ucitajOglase();
    const filtrirano = items.filter(o => o.kategorija === kategorija);
    renderOglasi(filtrirano, container);
  } catch (e) {
    container.innerHTML = `<p style="color:#b00;">Greška: ${e.message}</p>`;
  }
}
