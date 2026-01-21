const API_BASE = "https://amea-oglasi-api.belmins1617.workers.dev";

async function ucitajOglase(kategorija) {
  const res = await fetch(
    `${API_BASE}/api/oglasi?kategorija=${encodeURIComponent(kategorija)}`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error("Ne mogu učitati oglase");
  const data = await res.json();
  return data.items || [];
}

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[m]));
}

function renderOglasi(items, container) {
  if (!items.length) {
    container.innerHTML = `<p style="opacity:.8;">Trenutno nema oglasa u ovoj kategoriji.</p>`;
    return;
  }

  container.innerHTML = items.map((o) => {
    const href = `oglas.html?id=${encodeURIComponent(o.id)}`;
    const thumb = (Array.isArray(o.slike) && o.slike.length) ? o.slike[0] : "";

    return `
      <a href="${href}" class="ad-link" style="text-decoration:none;color:inherit;display:block">
        <article class="ad-card">
          ${thumb ? `<img class="ad-img" src="${esc(thumb)}" alt="">` : ""}
          <div class="ad-body">
            <div class="ad-top">
              <h3 class="ad-title">${esc(o.naziv || "")}</h3>
              <div class="ad-price">${esc(o.cijena || "")}</div>
            </div>
            <div class="ad-meta">
              ${o.stanje ? `<span class="ad-badge">${esc(o.stanje)}</span>` : ""}
            </div>
            ${o.opis ? `<p class="ad-desc">${esc(o.opis)}</p>` : ""}
            ${(o.spec || []).length ? `<ul class="ad-spec">${o.spec.slice(0,4).map(s=>`<li>${esc(s)}</li>`).join("")}</ul>` : ""}
          </div>
        </article>
      </a>
    `;
  }).join("");
}

async function initOglasi(kategorija) {
  const container = document.getElementById("oglasi"); // <-- standard
  if (!container) return;

  container.innerHTML = "Učitavam...";

  try {
    const items = await ucitajOglase(kategorija);
    renderOglasi(items, container);
  } catch (e) {
    container.innerHTML = `<p style="color:#b00;">Greška: ${esc(e.message)}</p>`;
  }
}

window.initOglasi = initOglasi;
