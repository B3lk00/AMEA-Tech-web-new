const API_BASE = "https://amea-oglasi-api.belmins1617.workers.dev";

function fmtKM(v){
  const s = String(v ?? "").trim();
  if(!s) return "";
  if (/\bKM\b/i.test(s) || /€|\$/.test(s)) return s;
  if (/^\d+([.,]\d+)?$/.test(s)) return s + " KM";
  return s + " KM";
}

async function ucitajOglase(kategorija) {
  const res = await fetch(
    `${API_BASE}/api/oglasi?kategorija=${encodeURIComponent(kategorija)}&_=${Date.now()}`,
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
    const back = encodeURIComponent(
  location.pathname.split("/").pop() + location.search
);
const href = `oglas.html?id=${encodeURIComponent(o.id)}&back=${back}`;
    const thumb = (Array.isArray(o.slike) && o.slike.length) ? o.slike[0] : "";

    const qty = (o.kolicina === 0 || o.kolicina) ? Number(o.kolicina) : null;

    return `
      <a href="${href}" class="ad-link" style="text-decoration:none;color:inherit;display:block">
        <article class="ad-card">
          ${thumb ? `<img class="ad-img" src="${esc(thumb)}" alt="">` : ""}
          <div class="ad-body">
            <div class="ad-top">
              <h3 class="ad-title">${esc(o.naziv || "")}</h3>
              <div class="ad-price">${esc(fmtKM(o.cijena || ""))}</div>
            </div>

            <div class="ad-meta">
              ${o.stanje ? `<span class="ad-badge">${esc(o.stanje)}</span>` : ""}
              ${qty !== null ? `<span class="ad-badge">Na stanju: ${esc(qty)}</span>` : ""}
            </div>

            ${o.opis ? `<p class="ad-desc">${esc(o.opis)}</p>` : ""}
            ${(o.spec || []).length ? `<ul class="ad-spec">${o.spec.slice(0,4).map(s=>`<li>${esc(s)}</li>`).join("")}</ul>` : ""}
          </div>
        </article>
      </a>
    `;
  }).join("");
}

let _poll;

async function initOglasi(kategorija) {
  const container = document.getElementById("oglasi");
  if (!container) return;

  async function refresh(){
    try {
      const items = await ucitajOglase(kategorija);
      renderOglasi(items, container);
    } catch (e) {
      container.innerHTML = `<p style="color:#b00;">Greška: ${esc(e.message)}</p>`;
    }
  }

  container.innerHTML = "Učitavam...";
  await refresh();

  clearInterval(_poll);
  _poll = setInterval(refresh, 10000); // 10s
}

window.initOglasi = initOglasi;
