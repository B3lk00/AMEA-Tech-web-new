const API_BASE = "https://amea-oglasi-api.belmins1617.workers.dev";
console.log("oglasi-api.js loaded ✅", API_BASE);

async function ucitajOglase(kategorija) {
  console.log("initOglasi called:", kategorija);
  const res = await fetch(`${API_BASE}/api/oglasi?kategorija=${encodeURIComponent(kategorija)}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Ne mogu učitati oglase");
  const data = await res.json();
  return data.items || [];
}

function renderOglasi(items, container) {
  if (!items.length) {
    container.innerHTML = `<p style="opacity:.8;">Trenutno nema oglasa u ovoj kategoriji.</p>`;
    return;
  }

  container.innerHTML = items.map(o => `
    <article class="ad-card">
      <div class="ad-body">
        <div class="ad-top">
          <h3 class="ad-title">${o.naziv || ""}</h3>
          <div class="ad-price">${o.cijena || ""}</div>
        </div>
        <div class="ad-meta">
          ${o.stanje ? `<span class="ad-badge">${o.stanje}</span>` : ""}
        </div>
        ${o.opis ? `<p class="ad-desc">${o.opis}</p>` : ""}
        ${(o.spec || []).length ? `<ul class="ad-spec">${o.spec.slice(0,4).map(s=>`<li>${s}</li>`).join("")}</ul>` : ""}
        <div class="ad-contact">
          ${o.kontakt?.telefon ? `<a href="tel:${o.kontakt.telefon}">📞 ${o.kontakt.telefon}</a>` : ""}
          ${o.kontakt?.email ? `<a href="mailto:${o.kontakt.email}">✉️ ${o.kontakt.email}</a>` : ""}
        </div>
      </div>
    </article>
  `).join("");
}

async function initOglasi(kategorija) {
  const container = document.getElementById("oglasi");
  if (!container) return;
  try {
    const items = await ucitajOglase(kategorija);
    renderOglasi(items, container);
  } catch (e) {
    container.innerHTML = `<p style="color:#b00;">Greška: ${e.message}</p>`;
  }
}

window.initOglasi = initOglasi;
